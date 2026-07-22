import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildItemKey, isPositiveInt, jsonError } from "../_utils";

type MergeItemInput = {
  partId: number;
  quantity: number;
  priceAtAdd: number;
  options?: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return jsonError("UNAUTHORIZED", "Authentication required.", 401);
    }
    if (session.user.role !== "user") {
      return jsonError("FORBIDDEN", "Only users can use the cart.", 403);
    }

    const body = await req.json();
    const items = Array.isArray(body.items) ? (body.items as MergeItemInput[]) : [];

    if (!items.length) {
      return jsonError("INVALID_INPUT", "No items provided for merge.", 400);
    }

    const userId = Number(session.user.id);

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      for (const item of items) {
        const partId = Number(item.partId);
        const quantity = Number(item.quantity);
        const priceAtAdd = Number(item.priceAtAdd);
        const options = item.options ?? null;
        const optionsValue = item.options ?? Prisma.JsonNull;

        if (!isPositiveInt(partId) || !isPositiveInt(quantity) || !Number.isFinite(priceAtAdd)) {
          continue;
        }

        const key = buildItemKey(partId, options);

        await tx.cartItem.upsert({
          where: {
            cartId_key: {
              cartId: cart.id,
              key,
            },
          },
          update: {
            quantity: { increment: quantity },
            priceAtAdd,
            options: optionsValue,
          },
          create: {
            cartId: cart.id,
            partId,
            quantity,
            priceAtAdd,
            options: optionsValue,
            key,
          },
        });
      }

      const merged = await tx.cart.findFirst({
        where: { id: cart.id },
        include: { items: true },
      });

      return merged;
    });

    return NextResponse.json({ cart: result });
  } catch (error) {
    console.error("POST /api/cart/merge error:", error);
    return jsonError("SERVER_ERROR", "Unexpected server error.", 500);
  }
}

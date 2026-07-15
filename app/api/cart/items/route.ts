import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildItemKey, isPositiveInt, jsonError } from "../_utils";

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
    const partId = Number(body.partId);
    const quantity = Number(body.quantity);
    const priceAtAdd = Number(body.priceAtAdd);
    const options = body.options ?? null;
    const optionsValue = body.options ?? Prisma.JsonNull;

    if (!isPositiveInt(partId) || !isPositiveInt(quantity) || !Number.isFinite(priceAtAdd)) {
      return jsonError("INVALID_INPUT", "Invalid cart item data.", 400);
    }

    const key = buildItemKey(partId, options);
    const userId = Number(session.user.id);

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
      });

      const item = await tx.cartItem.upsert({
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

      return { cartId: cart.id, item };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/cart/items error:", error);
    return jsonError("SERVER_ERROR", "Unexpected server error.", 500);
  }
}

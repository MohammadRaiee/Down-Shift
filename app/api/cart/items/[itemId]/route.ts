import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPositiveInt, jsonError } from "../../_utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const {itemId} = await params
    console.log('تحديث عنصر في السلة');
    const session = await auth();
    if (!session?.user?.id) {
      return jsonError("UNAUTHORIZED", "Authentication required.", 401);
    }

    // const itemId = Number(params.itemId);
    if (!isPositiveInt( Number(itemId))) {
      return jsonError("INVALID_ITEM", "Invalid item id.", 400);
    }

    const body = await req.json();
    const quantity = Number(body.quantity);
    if (!isPositiveInt(quantity)) {
      return jsonError("INVALID_QUANTITY", "Quantity must be greater than zero.", 400);
    }

    const userId = Number(session.user.id);
    const item = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cart: { userId },
      },
    });

    if (!item) {
      return jsonError("NOT_FOUND", "Cart item not found.", 404);
    }

    const updated = await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("PATCH /api/cart/items error:", error);
    return jsonError("SERVER_ERROR", "Unexpected server error.", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return jsonError("UNAUTHORIZED", "Authentication required.", 401);
    }

    const {itemId} = await params;
    const itemIDNumber = Number(itemId);
    if (!isPositiveInt(itemIDNumber)) {
      return jsonError("INVALID_ITEM", "Invalid item id.", 400);
    }

    const userId = Number(session.user.id);
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemIDNumber,
        cart: { userId },
      },
    });

    if (!item) {
      return jsonError("NOT_FOUND", "Cart item not found.", 404);
    }

    await prisma.cartItem.delete({ where: { id: itemIDNumber } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/cart/items error:", error);
    return jsonError("SERVER_ERROR", "Unexpected server error.", 500);
  }
}

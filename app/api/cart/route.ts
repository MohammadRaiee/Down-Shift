import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "./_utils";

export async function GET() {
  try {
    console.log('جلب السلة'); 
    const session = await auth();
    if (!session?.user?.id) {
      return jsonError("UNAUTHORIZED", "Authentication required.", 401);
    }
    if (session.user.role !== "user") {
      return jsonError("FORBIDDEN", "Only users can use the cart.", 403);
    }

    const userId = Number(session.user.id);
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
      id: cart.id,
      items: cart.items,
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return jsonError("SERVER_ERROR", "Unexpected server error.", 500);
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Seller Parts API route" });
}

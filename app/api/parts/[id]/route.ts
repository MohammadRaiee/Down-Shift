import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `Part API route for ID: ${params.id}` });
}

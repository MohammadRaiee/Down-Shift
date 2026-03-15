import { prisma } from "@/lib/prisma";
import { NextResponse,NextRequest } from "next/server";
import {auth} from '@/auth'


export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
       
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

  
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const part = await prisma.part.create({
      data: {
        title: body.title,
        price: body.price,
        manufacturer: body.manufacturer,
        condition: body.condition,
        description: body.description,
        compatibleCars: body.compatibleCars,
        images: body.image,
        publisherId: +session.user.id,
      },
    });

    return NextResponse.json(part, { status: 201 });

  } catch (error) {
    console.error("Create Part Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
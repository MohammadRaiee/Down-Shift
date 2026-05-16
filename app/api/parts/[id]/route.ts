import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const invalidIdResponse = () =>
  NextResponse.json({ error: "Invalid part id" }, { status: 400 });

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const partId = Number(params.id);
  if (!Number.isInteger(partId) || partId <= 0) {
    return invalidIdResponse();
  }

  const part = await prisma.parts.findUnique({
    where: { id: partId },
    include: {
      cars: {
        include: {
          carModel: {
            include: { brand: true },
          },
        },
      },
    },
  });

  if (!part) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const firstCar = part.cars[0]?.carModel;
  const years = part.cars.map((car) => car.carModel.year);

  return NextResponse.json({
    id: part.id,
    name: part.name,
    price: Number(part.price),
    description: part.description,
    partNumber: part.partNumber,
    countryOfOrigin: part.countryOfOrigin,
    quality: part.quality,
    categoryId: part.categoryId,
    image: part.image?.[0] ?? null,
    brandName: firstCar?.brand?.name ?? "",
    modelName: firstCar?.name ?? "",
    years,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
const { id } = await params;
  const partId = Number(id);
  if (!Number.isInteger(partId) || partId <= 0) {
    return invalidIdResponse();
  }

  const existing = await prisma.parts.findFirst({
    where: { id: partId, publisherId: Number(session.user.id) },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const {
    name,
    price,
    description,
    partNumber,
    brandName,
    modelName,
    years,
    quality,
    countryOfOrigin,
    image,
    categoryId,
  } = body;
console.log(name, price, description, partNumber, brandName, modelName, years, quality, countryOfOrigin, image, categoryId , 'ffffffffffffffffffffffffffffffffffffffffff  ') 
  if (!name || !price || !brandName || !modelName || !quality || !countryOfOrigin || !Array.isArray(years)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPart = await tx.parts.update({
      where: { id: partId },
      data: {
        name,
        price: Number(price),
        description,
        partNumber,
        quality,
        countryOfOrigin,
        categoryId: categoryId ? Number(categoryId) : null,
        image: image ? [image] : existing.image,
      },
    });

    let brand = await tx.carBrand.findUnique({ where: { name: brandName } });
    if (!brand) {
      brand = await tx.carBrand.create({ data: { name: brandName } });
    }

    await tx.partCar.deleteMany({ where: { partId } });

    const partCarConnections = [] as Array<{ partId: number; carModelId: number }>;
    for (const year of years) {
      let carModel = await tx.carModel.findFirst({
        where: {
          brandId: brand.id,
          name: modelName,
          year: Number(year),
        },
      });

      if (!carModel) {
        carModel = await tx.carModel.create({
          data: {
            brandId: brand.id,
            name: modelName,
            year: Number(year),
          },
        });
      }

      partCarConnections.push({ partId, carModelId: carModel.id });
    }

    if (partCarConnections.length) {
      await tx.partCar.createMany({
        data: partCarConnections,
        skipDuplicates: true,
      });
    }

    return updatedPart;
  });

  return NextResponse.json({ message: "Part updated successfully", partId: result.id });
}

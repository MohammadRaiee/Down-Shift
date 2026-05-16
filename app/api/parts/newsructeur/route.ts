import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from '@/auth'
export async function POST(req:any, res:any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

  const session = await auth()
    if (!session) {
       
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
 const body = await req.json();
    const { name, price, description, partNumber, brandName, modelName, years, quality ,countryOfOrigin,image, categoryId } = body;
    // years = [2018, 2019, 2020] مثلا
    if (!name || !price || !brandName || !modelName ||!quality  ||!countryOfOrigin ||!years || !Array.isArray(years)) {
      return NextResponse.json({ error: "Missing required fields" },    { status: 400 });
    }

    // 1️⃣ إنشاء القطعة
    const part = await prisma.parts.create({
      data: {
        name,
        image:[image],
        price: Number(price),
        description,
        partNumber,
        publisherId:  +session.user.id,
        quality,
        countryOfOrigin,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    // 2️⃣ الحصول على الـ brand
    let brand = await prisma.carBrand.findUnique({ where: { name: brandName } });
    if (!brand) {
      brand = await prisma.carBrand.create({ data: { name: brandName } });
    }

    // 3️⃣ معالجة كل سنة وربطها بالموديل
    const partCarConnections = [];

    for (const year of years) {
      // تحقق إذا الموديل موجود للسنة
      let carModel = await prisma.carModel.findFirst({
        where: {
          brandId: brand.id,
          name: modelName,
          year: Number(year),
        },
      });

      // إذا لم يكن موجود أنشئه
      if (!carModel) {
        carModel = await prisma.carModel.create({
          data: {
            brandId: brand.id,
            name: modelName,
            year: Number(year),
          },
        });
      }

      // أضف الربط بين القطعة والموديل
      partCarConnections.push({
        partId: part.id,
        carModelId: carModel.id,
      });
    }

    // 4️⃣ إضافة كل الروابط في جدول PartCar
    await prisma.partCar.createMany({
      data: partCarConnections,
      skipDuplicates: true, // لتجنب تكرار الرابط إذا كان موجود بالفعل
    });

    return NextResponse.json({ message: "Part added successfully", partId: part.id },    { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" },    { status: 401 });
  }
}




// model Part {
//   id             String    @id @default(cuid())
//   title          String
//   price          Decimal   @db.Decimal(10, 2)
//   manufacturer   String
//   condition      Condition
//   compatibleCars String[]
//   publisherId    Int
//   images         String[]
//   description    String?
//   createdAt      DateTime  @default(now())
//   updatedAt      DateTime  @updatedAt
//   stock          Int       @default(0)
//   publisher      User      @relation(fields: [publisherId], references: [id], onDelete: Cascade)

//   @@index([manufacturer])
//   @@index([condition])
//   @@index([compatibleCars], type: Gin)
// }

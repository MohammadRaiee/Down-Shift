import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
   
    // التحقق من المدخلات
    if (!year || !make || !model) {
      return NextResponse.json(
        { error: 'يرجى إدخال السنة والماركة والموديل' },
        { status: 400 }
      );
    }


    // البحث عن جميع CarModels التي تطابق السنة والموديل والماركة
    const carModels = await prisma.carModel.findMany({
      where: {
        year: Number(year),
        name: { contains: model, mode: 'insensitive' },
        brand: {
          name: { contains: make, mode: 'insensitive' },
        },
      },
      include: { brand: true },
    });


    if (carModels.length === 0) {
      return NextResponse.json([]);
    }

    // الحصول على IDs الموديلات
    const carModelIds = carModels.map(cm => cm.id);
    // البحث عن القطع المرتبطة بهذه الموديلات
    const parts = await prisma.parts.findMany({
      where: {
        cars: {
          some: {
            carModelId: { in: carModelIds },
          },
        },
      },
      include: {
        cars: {
          include: {
            carModel: {
              include: { brand: true },
            },
          },
        },
        publisher: {
          select: {
            id: true,
            storeName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(parts);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في البحث' },
      { status: 500 }
    );
  }
}

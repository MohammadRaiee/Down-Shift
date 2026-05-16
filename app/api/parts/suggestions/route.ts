import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'brands' | 'models' | 'years'
    const query = searchParams.get('query') || '';
    const brandId = searchParams.get('brandId');
    const limitParam = searchParams.get('limit');
    const parsedLimit = limitParam ? Number(limitParam) : undefined;
    const take = Number.isFinite(parsedLimit) && parsedLimit && parsedLimit > 0 ? parsedLimit : 10;

    if (!type) {
      return NextResponse.json({ error: 'نوع البحث مطلوب' }, { status: 400 });
    }

    // الحصول على اقتراحات الماركات
    if (type === 'brands') {
      const brands = await prisma.carBrand.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: { id: true, name: true },
        take,
      });
      return NextResponse.json(brands);
    }

    // الحصول على اقتراحات الموديلات
    if (type === 'models') {
      const where: any = {
        name: { contains: query, mode: 'insensitive' },
      };
      if (brandId) {
        where.brandId = Number(brandId);
        console.log(where.brandId,'brandId','ssssssssssssssssssssssssssssssssssssssssssssssssssss');
      }

      const models = await prisma.carModel.findMany({
        where,
        select: { id: true, name: true, brandId: true, year: true },
        orderBy: { year: 'desc' },
        take,
      });
      return NextResponse.json(models);
    }

    // الحصول على اقتراحات السنوات
    if (type === 'years') {
      const years = await prisma.carModel.findMany({
        where: {
          ...(query && { year: { equals: Number(query) } }),
          ...(brandId && { brandId: Number(brandId) }),
        },
        select: { year: true },
        distinct: ['year'],
        orderBy: { year: 'desc' },
      });
      const uniqueYears = Array.from(new Set(years.map(y => y.year)));
      const limitedYears = Number.isFinite(parsedLimit) && parsedLimit && parsedLimit > 0
        ? uniqueYears.slice(0, parsedLimit)
        : uniqueYears;
      return NextResponse.json(limitedYears);
    }

    return NextResponse.json({ error: 'نوع غير صحيح' }, { status: 400 });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحميل الاقتراحات' },
      { status: 500 }
    );
  }
}

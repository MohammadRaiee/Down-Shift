import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PublicParts from "@/components/parts/public_parts";
export default async function PartLayout() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "seller") {
    return <div className="px-6 py-10">غير مصرح بالوصول.</div>;
  }

  const userId = Number(session.user.id);
  const partsFromDb = await prisma.parts.findMany({
    where: { publisherId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      publisher: true,
      cars: {
        include: {
          carModel: {
            include: { brand: true },
          },
        },
      },
    },
  });

  const parts = partsFromDb.map((part: any) => ({
    ...part,
    price: Number(part.price),
  }));

  return (
    <div className="space-y-6 px-6 py-10">
      <h2 className="text-xl font-semibold">القطع التي نشرتها</h2>
      {parts.length === 0 ? (
        <p>لا يوجد قطع منشورة</p>
      ) : (
        <PublicParts parts={parts as any} />
      )}
    </div>
  );
}
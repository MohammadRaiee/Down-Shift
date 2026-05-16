import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardPageClient from "@/components/dashboard/DashboardPageClient";

export default async function DashboardPage() {
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

  return <DashboardPageClient initialParts={parts} sellerId={userId} />;
}
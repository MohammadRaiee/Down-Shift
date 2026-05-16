import { prisma } from "@/lib/prisma";
import { Parts } from "@prisma/client";
import PublicPageClient from "@/components/PublicPageClient";

export default async function Page() {
  const partsFromDb = await prisma.parts.findMany({
    orderBy: {
      createdAt: "desc",
    },
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

  return <PublicPageClient initialParts={parts} />;
}
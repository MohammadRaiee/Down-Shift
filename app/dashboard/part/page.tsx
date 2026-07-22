import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ItemDisplaySection from "@/components/itemDisplay/section";
export  default async  function Part(){

  
const session = await auth();

  // Check if the user is authenticated and is a seller
  if (!session?.user?.id || session.user.role !== "seller") {
    return <div className="px-6 py-10">Unauthorized access.</div>;
  }

  const userId = Number(session.user.id);
  
  // Fetch parts from the database
  const partsFromDb = await prisma.parts.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      publisher: {
        select: {
          id: true,
          storeName: true,
          image: true,
        },
      },
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
    return <div>
        <ItemDisplaySection parts={parts} />
    </div>
}
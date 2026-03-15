import { prisma } from "@/lib/prisma";
import { Part } from "@prisma/client";
import PublicParts from '@/components/parts/public_parts'
export default async function Parts(){
    
  const partsFromDb = await prisma.part.findMany({
   orderBy: {
      createdAt: "desc",
    },
  });

  const parts = partsFromDb.map((part: Part) => ({
    ...part,
    price: Number(part.price),
  }));


    return (<>
    <PublicParts parts={parts} />
    </>)
}
import { prisma } from "@/lib/prisma";

export const isItemOwnedBySeller = async (itemId: number, publisherId: number) => {
  const count = await prisma.parts.count({
    where: {
      id: itemId,
      publisherId: publisherId,
    },
  });


  return count > 0; 
};
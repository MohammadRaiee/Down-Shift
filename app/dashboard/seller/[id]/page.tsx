import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ItemDisplaySection from "@/components/itemDisplay/section";


interface PageProps {
  params: Promise<{ id: string }>;
}

const PartPage = async ({ params }: PageProps) => {

const session = await auth();
const resolvedParams = await params;


if(!session){
  /// error authinticate
}

if(session?.user.role !== 'seller'){
  /// error unuthorizen
}

if(session?.user.id !== resolvedParams.id){
  /// error 
} 


  const userId = Number(session?.user.id);
  const partsFromDb = await prisma.parts.findMany({
    where: { publisherId: userId },
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

  return (
    <div>
     <ItemDisplaySection parts={parts} />
    </div>
  );
};

export default PartPage;
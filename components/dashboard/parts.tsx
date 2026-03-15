import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import ClodinaryImage from "@/components/ui/clodinary_image"
import { ReactNode } from "react";
export default async function PartLayout() {

  const session = await auth();

  if (session?.user.role !=='seller') {
    return <></>;
  }

  const userId = +session.user.id;

  const parts = await prisma.part.findMany({
    where: {
      publisherId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <div>
      <h2>القطع التي نشرتها</h2>

      {parts.length === 0 ? (
        <p>لا يوجد قطع منشورة</p>
      ) : (
        parts.map((part : any) => (
          <div key={part.id} style={{border:"1px solid #ddd", padding:"10px", margin:"10px"}}>
            <h3>{part.title}</h3>
            <p>السعر: {part.price.toString()}</p>
            <p>الشركة المصنعة: {part.manufacturer}</p>
            <p>الحالة: {part.condition}</p>
            <p>المخزون: {part.stock}</p>
            {part.images.length===0?null:
            part.images.map((image : any)  =>  <ClodinaryImage
          src={image}/>)
            
            }
          </div>
        ))
      )}
    </div>
  );
}
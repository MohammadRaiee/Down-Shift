'use client'
import {Button} from "@/components/ui/button";
import Image from "next/image";
import PartImage from "@/components/ui/clodinary_image";
import { useEffect } from "react";

export interface Brand {
  id: number;
  name: string;
  createdAt: string;
}

export interface CarModel {
  id: number;
  brandId: number;
  name: string;
  year: number;
  createdAt: string;
  brand: Brand;
}

export interface CarRelation {
  id: number;
  partId: number;
  carModelId: number;
  carModel: CarModel;
}

export interface Publisher {
  id: number;
  storeName: string;
  image: Record<string, any>; // Used Record because the object is currently empty {}
}

// Main Type for Part
export interface PartDetails {
  id: number;
  partBrand: string;
  name: string;
  partNumber: string;
  price: number;
  description: string;
  publisherId: number;
  createdAt: string;
  image: { imageURL: string ,public_id:string}[]; // Currently an empty array, you can change 'any' to your specific image type later
  countryOfOrigin: string;
  quality: "Original" | "Average" | "Poor"; // You can add other quality levels here as Literal Types
  categoryId: number;
  publisher: Publisher;
  cars: CarRelation[];
}

export default  function({ parts }: { parts: PartDetails[] }) {
  const firstTen = parts.slice(0, 10);
  
  // Logic for deleting parts
  // useEffect(() => {
  //   const deleteParts = async () => {
  //     try {
  //       const res =  await fetch ("http://localhost:3000/api/parts/delete", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ items: firstTen.map(p => ({id:p.id , public_id: p.image.map(img => img.public_id)})) })
  //       });
  //       if(!res.ok){
  //         console.log("Failed to delete parts");
  //       } 
  //     } catch (error) {
  //       console.error("Error deleting parts: in catch section error", error);
  //     }
  //   }
  //   deleteParts()
  //   console.log({ items: parts.map(p => p.id) })
  // });
type PartQuality = "Original" | "Average" | "Poor";

const QUALITY_STYLES: Record<PartQuality, string> = {
  Original: "bg-emerald-600",
  Average: "bg-amber-600",
  Poor: "bg-orange-700",
};

const getQualityStyle = (quality?: PartQuality) =>
  quality ? QUALITY_STYLES[quality] : "bg-zinc-600";
const isRecentlyAdded = (createdAt: string) => {
  if (!createdAt) return false;
  return (Date.now() - new Date(createdAt).getTime()) / 86400000 <= 14;
};
console.log(parts);
  return(

   <div className=" mx-auto max-w-400 w-full justify-around bg-zinc-900 py-10" >
  <div className="w-[95%] mx-auto">
    <div className="grid grid-cols-[repeat(auto-fill,220px)] gap-3 justify-center " >
      {parts.map((part, i) => {
        return (
          <div key={i} className="relative w-55 h-100 gap-3 border group border-zinc-600 overflow-hidden rounded-sm cursor-pointer mx-auto bg-zinc-900" >
            <div className="relative w-full h-60" >
              {part.image.length > 0 &&
                <PartImage src={part.image[0]?.imageURL} />
              }
            </div>

            {isRecentlyAdded(part.createdAt) && (
              <p className="absolute top-3 left-3 bg-red-600 text-white rounded-[3px] text-xs font-bold px-2 py-1">New</p>
            )}

            <div className="px-3 mt-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
                <span className="text-red-500">{part.partBrand}</span>
                {part.partNumber && (
                  <span className="text-zinc-500 font-normal normal-case">#{part.partNumber}</span>
                )}
              </div>

              <h1 className="text-white text-left text-sm font-bold mt-1 leading-tight line-clamp-2 min-h-[2.2em]">
                {part.name}
              </h1>

              <div className="flex items-center justify-between mt-1.5">
                {part.quality ? (
                  <span className={`text-white rounded-[3px] text-[10px] font-bold px-2 py-1 ${getQualityStyle(part.quality)}`}>
                    {part.quality}
                  </span>
                ) : (
                  <span />
                )}
                <p className="text-white text-xl font-bold">
                  {part.price.toFixed(2)}
                </p>
              </div>

              {part.description && (
                <p className="text-zinc-300 text-left text-[11px] mt-1 line-clamp-1">
                  {part.description}
                </p>
              )}
            </div>

            <Button className=" absolute bg-red-600 hover:bg-red-500 hover:text-primary-foreground border-0 bottom-3 left-1/2 transform -translate-x-1/2 w-full mt-4 rounded-[3px] items-center justify-center max-w-47.5 " variant="outline">Add to Cart</Button>
          </div>
        )
      })}
    </div>
  </div>
</div>
    // <div className=" mx-auto max-w-400 w-full justify-around bg-zinc-900 py-10" >
    //   <div className="w-[95%] mx-auto">
    //     <div className="grid grid-cols-[repeat(auto-fill,220px)] gap-3 justify-center " >
    //       {parts.map((part,i) => { 
    //         return (
    //           <div key={i} className="relative w-55 h-100 gap-3 border group border-zinc-600 overflow-hidden rounded-sm cursor-pointer mx-auto bg-zinc-900" >
    //             <div className="relative w-full h-60" >
    //               {part.image.length>0 &&
    //                 <PartImage
    //                   src={part.image[0]?.imageURL}
    //                 />
    //               }
    //             </div>
    //             <p className="absolute top-3 left-3 bg-red-600 text-white rounded-[3px] text-xs font-bold px-2 py-1" >New</p>
    //             <p className="absolute top-3 left-16 bg-red-600 text-white rounded-[3px] text-xs font-bold px-2 py-1" >delete</p>
    //             <p className="absolute top-3 left-29 bg-red-600 text-white rounded-[3px] text-xs font-bold px-2 py-1" >New</p>

    //             <h1 className="text-white text-center text-2xl font-bold mt-4">{part.price.toFixed(2)}</h1>
    //             <p className="text-zinc-300 text-center text-[12px] mt-4">{part.description}</p>
    //             <p className="text-zinc-300 text-center text-[12px] mt-1"></p>
    //             <Button className=" absolute bg-red-600 hover:bg-red-500 hover:text-primary-foreground border-0 bottom-3 left-1/2 transform -translate-x-1/2 w-full mt-4 rounded-[3px] items-center justify-center max-w-47.5 " variant="outline">Add to Cart</Button>
    //           </div>
    //         )
    //       })}
    //     </div>
    //   </div>
    // </div>
  )
}


// 'use client'
// import {Button} from "@/components/ui/button";
// import Image from "next/image";
// import { useEffect } from "react";

// export interface Brand {
//   id: number;
//   name: string;
//   createdAt: string;
// }

// export interface CarModel {
//   id: number;
//   brandId: number;
//   name: string;
//   year: number;
//   createdAt: string;
//   brand: Brand;
// }

// export interface CarRelation {
//   id: number;
//   partId: number;
//   carModelId: number;
//   carModel: CarModel;
// }

// export interface Publisher {
//   id: number;
//   storeName: string;
//   image: Record<string, any>; // تم استخدام Record لأن الكائن الحالي فارغ {}
// }

// // الـ Type الرئيسي للقطعة (Part)
// export interface PartDetails {
//   id: number;
//   partBrand: string;
//   name: string;
//   partNumber: string;
//   price: number;
//   description: string;
//   publisherId: number;
//   createdAt: string;
//   image: { imageURL: string ,public_id:string}[]; // مصفوفة فارغة حالياً، يمكنك تغيير any لنوع الصور المستخدم لديك لاحقاً
//   countryOfOrigin: string;
//   quality: "Original" | "Average" | "Copy"; // يمكنك إضافة بقية حالات الجودة هنا كمستند نصي (Literal Types)
//   categoryId: number;
//   publisher: Publisher;
//   cars: CarRelation[];
// }

// export default  function({ parts }: { parts: PartDetails[] }) {
//   const firstTen = parts.slice(0, 10);
//   // const arrForDelete =firstTen.map((part) => ({
//   //   id: part.id,
//   //   public_id: part.image.map(image => image.public_id) || null, // Assuming each part has at least one image
//   // }));
// //     const publicIdsToDelete = arrForDelete.map((item) => item.public_id.length>0? item.public_id.map(url=>({ publicIds: url })) : null).filter((id: { publicIds: string } | null) => id !== null);

// // console.log(publicIdsToDelete.flat())
// useEffect(() => {
//   const deleteParts = async () => {
//     try {
// const res =  await fetch ("http://localhost:3000/api/parts/delete", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ items: firstTen.map(p => ({id:p.id , public_id: p.image.map(img => img.public_id)})) })
//   });
//   if(!res.ok){
//     console.log("Failed to delete parts");
//   } }catch (error) {
//     console.error("Error deleting parts: im catch section erroer", error);
//   }

// }
// deleteParts()
// console.log({ items: parts.map(p => p.id) })
// });



//     return(<div className=" mx-auto max-w-400 w-full justify-around bg-zinc-900 py-10"  >
//         <div className="w-[95%] mx-auto">
//         <div className="grid grid-cols-[repeat(auto-fill,220px)] gap-3 justify-center " >
//         {parts.map((part,i) => { //console.log(part.image[0]?.imageURL , "part");
//              return <div key={i} className="relative w-55 h-100 gap-3 border group border-zinc-600 overflow-hidden rounded-sm cursor-pointer mx-auto bg-zinc-900" >
//         <div className="relative w-full h-60" >
//                    {part.image.length>0 && i> 65&& <Image
//                       src={part.image[0]?.imageURL  }
//                       alt='Image'
//                       fill
//                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                     />}
//         </div>
//         <p className="absolute top-3 left-3 bg-red-600 text-white rounded-[3px]   text-xs font-bold px-2 py-1" >New</p>
//                 <p className="absolute top-3 left-16 bg-red-600 text-white rounded-[3px]   text-xs font-bold px-2 py-1" >delete</p>

//         <p className="absolute top-3 left-29 bg-red-600 text-white rounded-[3px]   text-xs font-bold px-2 py-1" >New</p>

//         <h1 className="text-white text-center text-2xl font-bold mt-4">{part.price.toFixed(2)}</h1>
//         <p className="text-zinc-300 text-center text-[12px] mt-4">{part.description}</p>
// <p className="text-zinc-300 text-center text-[12px] mt-1"></p>
// <Button className=" absolute bg-red-600 hover:bg-red-500 hover:text-primary-foreground border-0 bottom-3 left-1/2 transform -translate-x-1/2 w-full mt-4 rounded-[3px] items-center justify-center max-w-47.5 " variant="outline">Add to Cart</Button>
//         </div>})}
//         </div>
//     </div>
//     </div>)}
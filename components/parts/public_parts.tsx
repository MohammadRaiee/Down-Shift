import ClodinaryImage from "@/components/ui/clodinary_image"



interface Props {
  parts: Part[];
}

export default function PartList({ parts }: Props) {
  return (
    <>
      <h2>القطع التي نشرتها</h2>
      {parts.length === 0 ? (
        <p>لا يوجد قطع منشورة</p>
      ) : (
        parts.map((part) => (
          <div
            key={part.id}
            style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}
          >
            <h3>{part.title}</h3>
            <p>السعر: {part.price.toString()}</p>
            <p>الشركة المصنعة: {part.manufacturer}</p>
            <p>الحالة: {part.condition}</p>
            <p>المخزون: {part.stock}</p>

            {part.images.length > 0 &&
              part.images.map((image, index) => (
                <ClodinaryImage key={index} src={image} />
              ))}
          </div>
        ))
      )}
    </>
  );
}

// export default function ({parts}){
//     return <>
//           <h2>القطع التي نشرتها</h2>
//   {parts.length === 0 ? (
//         <p>لا يوجد قطع منشورة</p>
//       ) : (
//         parts.map((part : any) => (
//           <div key={part.id} style={{border:"1px solid #ddd", padding:"10px", margin:"10px"}}>
//             <h3>{part.title}</h3>
//             <p>السعر: {part.price.toString()}</p>
//             <p>الشركة المصنعة: {part.manufacturer}</p>
//             <p>الحالة: {part.condition}</p>
//             <p>المخزون: {part.stock}</p>
//             {part.images.length===0?null:
//             part.images.map((image : any)  =>  <ClodinaryImage
//           src={image}/>)
            
//             }
//           </div>
//         ))
//       )}</>
// }

export interface Part {
  id: string;

  title: string;
  price: number;
  manufacturer: string;
  condition: string;
  compatibleCars: string[];
  publisherId: number;

  stock: number;

  images: string[];

  description?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// // interface Parts {}
// // export interface User {
// //   id: number;
// //   email: string;
// //   passwordHash: string;
// //   firstName?: string | null;
// //   lastName?: string | null;
// //   role: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// //   isVerified: boolean;

// //   parts: Part[];
// // }
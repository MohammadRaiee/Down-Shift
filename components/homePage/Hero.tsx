import Image from "next/image";
import {Input} from "@/components/ui/input";
import SimpleCarousel from "../ui/SimpleCarousel";
export default function Hero() {

  return(

    <div className=" w-full h-150 md:h-187" >

<div className="relative w-full h-full " >
<Image src="/haha.webp" alt="Hero Image"  fill objectFit="cover" className="felx md:hidden"/>
<Image src="/end.webp" alt="Hero Image"  fill objectFit="cover" className="hidden md:flex"/>

  <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/30 to-red-950/20" />
  <div className="absolute inset-0 bg-linear-to-b  via-black/30 " />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_20%_at_50%_100%,rgba(0,0,0,0.85)_0%,transparent_100%)]"></div>

  <div className=" max-w-500 w-[95%]  justify-center gap-[4%] absolute bottom-8 left-1/2 -translate-x-1/2 md:flex hidden" >
    <Input className=" w-[27%] 2xl:w-[20%] text-white text-lg!  placeholder:text-white placeholder:text-lg border-black/50 h-10 rounded-[9px] bg-red-600 opacity-80" placeholder="Select Brand" />
    <Input className=" w-[27%] 2xl:w-[20%] text-white text-lg! placeholder:text-white placeholder:text-lg border-black/50 h-10  rounded-[9px] bg-red-600 opacity-80" placeholder="Select Model" />
    <Input className=" w-[27%] 2xl:w-[20%] text-white text-lg! placeholder:text-white placeholder:text-lg border-black/50 h-10  rounded-[9px] bg-red-600 opacity-80" placeholder="Select Year" />
  </div>

<div className="flex flex-col w-full px-3 justify-center absolute top-[8%] md:top-5 left-1/2 -translate-x-1/2" >
  <h1 className=" text-3xl sm:text-[235%] leading-none wrap-break-word font-bold text-gray-300 opacity-85 mb-2 text-center">Find the Perfect Car Part</h1>
  <p className=" text-sm sm:text-lg text-red-500/80 text-center">Easily search and discover the right parts for your vehicle.</p>
</div>
<div className="flex flex-col sm:flex-row  mx-auto justify-center max-w-500 sm:w-[95%] w-[80%] gap-5 border-2 border-red-500/50 p-4 rounded-lg bg-black/50 absolute bottom-8 left-1/2 -translate-x-1/2  md:hidden" >
  <Input className=" w-full text-white text-lg! placeholder:text-white  placeholder:text-lg border-black/50 h-10  rounded-[9px] bg-red-600 opacity-65" placeholder="Select Brand" />
  <Input className=" w-full text-white text-lg! placeholder:text-white placeholder:text-lg border-black/50 h-10 rounded-[9px] bg-red-600 opacity-65" placeholder="Select Model" />
  <Input className=" w-full text-white text-lg! placeholder:text-white placeholder:text-lg border-black/50 h-10 rounded-[9px] bg-red-600 opacity-65" placeholder="Select Year" />

</div>
</div>

{/* <SimpleCarousel  /> */}
</div>
    
)
}

      {/* <div className="relative w-full min-h-screen" style={{ height }}>
<Image src="/HeroImage.webp" alt="Hero Image" fill objectFit="cover" className=" z-0"/>

  <div className="absolute inset-0  bg-gradient-to-b from-red-950/20 via-black/60 to-black" />

</div>
<div className="relative w-full min-h-screen" style={{ height }}>
<Image src="/HeroImage.webp" alt="Hero Image" fill objectFit="cover" className=" z-0"/>

  <div className="absolute inset-0   bg-gradient-to-tr from-red-950/40 via-black/70 to-black" />

</div> */}

{/* <div className="flex flex-col absolute top-5 left-2" > */}
  {/* <h1 className="text-4xl font-bold text-red-500/80 opacity-85 mb-2">Find the Perfect Car Part</h1>
  <p className="text-lg text-gray-300">Easily search and discover the right parts for your vehicle.</p> */}
  {/* <h1 className="text-9xl font-bold text-red-500/80 opacity-85 mb-2">ORIGIN</h1> */}
    {/* <h1 className="text-[680%] leading-[0.9] font-bold text-red-500/90 opacity-70 ">ORIGIN</h1>
    <h1 className="text-[600%] ps-2  leading-[0.9] font-bold text-gray-500 opacity-90 ">PARTS</h1> */}

{/* </div> */}

// import Image from "next/image";

// export default function Hero() {
//   const height = 700;

//   return (
//     <div className="relative w-full overflow-hidden" style={{ height }}>
//       {/* الصورة الخلفية */}
//       <Image 
//         src="/HeroImage.webp" 
//         alt="Hero Image" 
//         fill 
//         className="object-cover z-0" 
//       />
      
//       {/* الظل (التدرج اللوني) المباشر عبر خصائص CSS */}
//       <div 
//         className="absolute inset-0 z-10" 
//         style={{
//           background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
//         }}
//       />
//     </div>
//   );
// }



//   return (
//     <section className="relative w-full h-[700px] overflow-hidden">
//       <Image
//         src="/Hero2.jpg"
//         alt="Hero Image"
//         fill
//         priority
//         quality={100}
//         sizes="100vw"
//         className="object-cover object-center"
//       />
//       <div className="absolute inset-0 bg-black/10" />
//     </section>
//   );
// }


// import Image from "next/image";

// type HeroProps = {
//   height?: number | string;
//   src?: string;
//   alt?: string;
// };

// export default function Hero({
//   height = 700,
//   src = "/Hero.jpg",
//   alt = "Hero Image",
// }: HeroProps) {
//   return (
//     <div className="relative w-full overflow-hidden" style={{ height }}>
//       <Image
//         src={src}
//         alt={alt}
//         fill
//         className="object-cover"
//         priority
//       />
//     </div>
//   );
// }

// import Image from "next/image";

// export default function Hero() {
//   return (
//     <div className="relative w-full h-125">
//       <Image
//         src="/Hero.jpg"
//         alt="Hero Image"
//         fill
//         className="object-cover"
//       />
//     </div>
//   );
// }
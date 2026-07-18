import Image from "next/image";
import { Button } from "../ui/button";
import CloudinaryImage from "@/components/ui/clodinary_image"
export default function(){
    return( <div className='max-w-500 w-[95%] mx-auto ' > <div className="flex flex-col justify-between   mx-auto max-w-400 gap-12 items-center w-full lg:flex-row h-auto 2xl:gap-0   py-10 " >
       <div className='flex w-full lg:w-[50%] justify-center' >
        <div className=" relative w-[110%] h-80 sm:w-150 sm:h-120" >
            <CloudinaryImage
              src="https://res.cloudinary.com/dlxcorjvq/image/upload/v1784313030/car_parts/ogxpjsuendoxhhub9tvj.jpg"
            //   alt='Image'
            //   fill
            //   className="absolute inset-0 w-full h-full object-cover transition-transform rounded-sm duration-700 group-hover:scale-105"
            />
        </div></div>
        <div className='flex lg:w-[50%] lg:h-110' >
        <div className="flex flex-col sm:max-w-150  gap-3" >
    <div className="flex justify-between items-center w-full" >
   <div className="flex items-center w-full gap-4">
        <div className="relative flex items-center shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-red-600" >
          <Image 
            src="/haha.webp" // أو رابط خارجي
            alt="صورة شخصية"
            fill
            sizes="(max-width: 64px) 100vw, 64px"
            className="object-cover items-center justify-center"
          />
        </div>
                          <p className="text-2xl text-white">Down Shift</p>
    

        </div>
     {/* <Button className="bg-red-600 hover:bg-red-500 hover:text-primary-foreground border-0 w-full  rounded-[3px] items>center justify-center max-w-18 " variant="outline">Edit</Button> */}
        </div>
            <div className="flex justify-between items-center w-full" >
            <h1 className="text-white text-2xl font-bold pt-7">Feul Pump</h1>
        <p className="pt-7" >2123544</p>
        </div>

            <p className="text-zinc-300 text-[16px] mt-1">A car fuel pump is a device that delivers fuel from the tank to the engine at the correct pressure for proper combustion.</p>
            {/* <p className="text-zinc-s300 text-[12px] mt-1">Additional details about the part, such as compatibility, materials used, and any special features.</p> */}
                              <div className="flex justify-between items-center w-full" >
      <p className="text-red-500 text-[14px] ">  <span className="text-red-500">Quality :</span>
       <span className="text-zinc-300">{` Good`}</span></p>
       <p className="text-red-500 text-[14px] ">  <span className="text-red-500">Made in </span>
       <span className="text-zinc-300">{` Germany`}</span></p>
        </div>
                <div className="flex justify-between items-center w-full" >
            <Button className="bg-red-600 hover:bg-red-500 hover:text-primary-foreground border-0 w-full mt-4 rounded-[3px] items>center justify-center max-w-47.5 " variant="outline">Add to Cart</Button>
            
        <p className="pt-3 pr-0 text-3xl text-green-400/90 font-medium" >200 $</p>
        </div>
        </div></div>
    </div></div>)
}

// Quality: Premium Quality

// Country of Origin: Turkey

//    id	Int	رقم تعريفي فريد للقطعة.
// createdAt	DateTime	تاريخ إضافة القطعة.
// categoryId	Int?	التصنيف الذي تنتمي إليه القطعة.

// name	String	اسم القطعة. ==
// partNumber	String?	رقم القطعة (اختياري وفريد). ==
// price	Float	سعر القطعة. ==
// description	String?	وصف القطعة (اختياري). == 
// publisherId	Int	معرف البائع الذي أضاف القطعة. ==
// image	String[]	مجموعة صور للقطعة. ==
// countryOfOrigin	String	بلد المنشأ. 
// quality	String	جودة القطعة (الافتراضي "Good").

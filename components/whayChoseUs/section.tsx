import SimpleCarousel from "../ui/SimpleCarousel";
import  WhyChooseUs  from "@/components/whayChoseUs/card";
export default function Section() {
    return (<div className="flex justify-center  mx-auto w-full bg-zinc-900" >
    <div className="flex flex-col max-w-500 items-center lg:flex-row w-full h-auto gap-3 p-10 " >
{/* <Category/> */}
<WhyChooseUs/>
<SimpleCarousel/>
  </div>
    </div>)
}
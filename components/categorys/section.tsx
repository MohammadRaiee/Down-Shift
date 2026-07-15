import Image from "next/image";
export default function Section() {
    return (<div className=" max-w-400 w-[95%] mx-auto h-auto pb-10">
    <div className=" grid grid-cols-[repeat(auto-fill,220px)] gap-3 justify-center " >
        {[1,2,3,3,,4,5,6,7,8,9].map((item) => (
              <div className="relative group border mt-10 border-zinc-600 overflow-hidden rounded-sm h-60 cursor-pointer bg-zinc-900 w-55" >
            <Image
              src="/haha.webp"
              alt='Image'
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-50 group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"  />
            <div className="flex flex-col gap-1 absolute bottom-0 transition-transform duration-700 translate-y-10 group-hover:translate-y-0 left-0 text-sm pl-3 pb-3" >
                <h3 className="text-white/90 text-lg font-bold ">Category Name</h3>
                <p className="text-zinc-300 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100 text-[12px]">Description of the category goes here.</p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.75 w-55 bg-red-600 transition-transform -translate-x-55 group-hover:translate-x-0 duration-700" ></div>
        </div>
        ) )}

</div>
    </div>)
}
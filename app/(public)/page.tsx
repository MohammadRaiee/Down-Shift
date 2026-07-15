import PartDetails from "@/components/partDetails/partDetails";
import { prisma } from "@/lib/prisma";
import { Parts } from "@prisma/client";
import PublicPageClient from "@/components/PublicPageClient";
import LogoLoader from '@/components/LogoLoader';
import Logo from '@/components/Logo'
import Hero from '@/components/homePage/Hero'
import Category from "@/components/categorys/section";
import Section from "@/components/whayChoseUs/section";
import ItemDisplaySection from "@/components/itemDisplay/section";
export default async function Page() {
  // const partsFromDb = await prisma.parts.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     publisher: true,
  //     cars: {
  //       include: {
  //         carModel: {
  //           include: { brand: true },
  //         },
  //       },
  //     },
  //   },
  // });

  // const parts = partsFromDb.map((part: any) => ({
  //   ...part,
  //   price: Number(part.price),
  // }));

  return (
    <div className="min-h-screen ">

 {/* <img src={`/bestLoader4.svg`} alt="Logo" className="w-40 h-30 mb-8" />
 <img src={`/best4.svg`} alt="Logo" className="w-40 h-30 mb-8" /> */}

      {/* <Logo width={160} height={120} />
      <LogoLoader /> */}
      <Hero />
      <Section/>
      <Category/>
      {/* <ItemDisplaySection/>  */}
      <PartDetails/>
      {/* <PartDetails/>
      <ItemDisplaySection/>  */}
      {/* <PublicPageClient initialParts={parts} /> */} 
    </div>
  );
}
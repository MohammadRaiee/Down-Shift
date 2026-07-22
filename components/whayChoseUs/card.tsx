import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchCheck, Boxes, Award } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <Card className="ring-0 border-0 shadow-none w-full lg:w-1/2 h-100 bg-neutral-800/5">
      <CardHeader className="mt-11 ">
        <CardTitle className="text-gray-50 mx-auto text-[40px] opacity-90">Why Choose Us?</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 mx-auto items-center justify-center text-gray-400 text-[20px] pt-4 ">
        <div className="flex items-center gap-3">
          <SearchCheck size={32} className="text-red-600  " />
          <span>Compare. Choose. Drive with Confidence.</span>
        </div>
        <div className="flex items-center gap-3">
          <Boxes size={32} className="text-red-600 " />
          <span>Thousands of Parts. Countless Possibilities.</span>
        </div>
        <div className="flex items-center gap-3">
          <Award size={32} className="text-red-600 " />
          <span>Because Your Vehicle Deserves the Best.</span>
        </div>
      </CardContent>
    </Card>
  );
}
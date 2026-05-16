import YmmSearch from "@/components/parts/YmmSearch";
export default function SearchPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">بحث عن قطع الغيار عبر YMM</h1>
      <YmmSearch />
    </div>
  );
}
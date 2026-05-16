'use client';

import { useState } from 'react';
import YmmSearch from '@/components/parts/YmmSearch';
import PublicParts from '@/components/parts/public_parts';
import {categoryIdsToNames} from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
}

interface PublicPageClientProps {
  initialParts: any[];
}

export default function PublicPageClient({ initialParts }: PublicPageClientProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);


  // عند عدم البحث: عرض القطع الأصلية
  // عند البحث: عرض نتائج البحث
  const displayParts = hasSearched ? searchResults : initialParts;

  // إضافة فلتر التصنيف
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // استخراج جميع التصنيفات المتوفرة من البيانات
  const categoriesIds = Array.from(
    new Set((hasSearched ? searchResults : initialParts).map((part: any) =>  part.categoryId).filter(Boolean))
  );
  const categories = categoryIdsToNames(categoriesIds);
console.log("Available categories:", categories);
  // تصفية القطع حسب التصنيف المحدد
  const filteredParts = selectedCategory === "all"
    ? displayParts
    : displayParts.filter((part: any) => part.categoryId === +selectedCategory);

  return (
    <div className="w-full">
      {/* مكون البحث */}
      <div className="mb-12 px-4">
        <YmmSearch 
          onSearch={(results: SearchResult[]) => {
            setSearchResults(results);
            setHasSearched(true);
          }}
        />

        {/* فلتر التصنيف */}
          <div className="flex flex-col gap-2 mt-4">
            {/* أزرار التصنيفات السريعة */}
            {categories.length > 4 && (
              <div className="flex gap-2 justify-end flex-wrap">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.category}
                    className={`btn btn-sm ${selectedCategory === cat.category ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSelectedCategory(cat.categoryId)}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            )}
            {/* قائمة التصنيفات */}
            <div className="flex justify-end">
              <select
                className="select select-bordered"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">كل التصنيفات</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>


        {/* زر لإعادة عرض جميع القطع */}
        {hasSearched && (
          <div className="text-center mt-4">
            <button
              onClick={() => setHasSearched(false)}
              className="btn btn-outline"
            >
              عرض جميع القطع
            </button>
          </div>
        )}
      </div>

      {/* القطع المعروضة */}
      {hasSearched && searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لم يتم العثور على نتائج</p>
        </div>
      ) : (
        <div className="space-y-12 px-4">
          <PublicParts parts={filteredParts as any} />
        </div>
      )}
    </div>
  );
}

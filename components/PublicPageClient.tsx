'use client';

import { useState } from 'react';
import YmmSearch from '@/deleted/ignoredparts/YmmSearch';
import PublicParts from '@/deleted/ignoredparts/public_parts';
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

  // When not searching: show initial parts
  // When searching: show search results
  const displayParts = hasSearched ? searchResults : initialParts;

  // Add category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract all available categories from data
  const categoriesIds = Array.from(
    new Set((hasSearched ? searchResults : initialParts).map((part: any) =>  part.categoryId).filter(Boolean))
  );
  const categories = categoryIdsToNames(categoriesIds);
  console.log("Available categories:", categories);

  // Filter parts by selected category
  const filteredParts = selectedCategory === "all"
    ? displayParts
    : displayParts.filter((part: any) => part.categoryId === +selectedCategory);

  return (
    <div className="w-full">
      {/* Search component */}
      <div className="mb-12 px-4">
        <YmmSearch 
          onSearch={(results: SearchResult[]) => {
            setSearchResults(results);
            setHasSearched(true);
          }}
        />

        {/* Category filter */}
          <div className="flex flex-col gap-2 mt-4">
            {/* Quick category buttons */}
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
            {/* Category dropdown */}
            <div className="flex justify-end">
              <select
                className="select select-bordered"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

        {/* Button to reset and show all parts */}
        {hasSearched && (
          <div className="text-center mt-4">
            <button
              onClick={() => setHasSearched(false)}
              className="btn btn-outline"
            >
              Show all parts
            </button>
          </div>
        )}
      </div>

      {/* Displayed parts */}
      {hasSearched && searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No results found</p>
        </div>
      ) : (
        <div className="space-y-12 px-4">
          <PublicParts parts={filteredParts as any} />
        </div>
      )}
    </div>
  );
}
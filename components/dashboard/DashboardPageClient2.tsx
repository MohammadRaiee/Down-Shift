"use client";

import { useState } from "react";
import YmmSearch from "@/deleted/ignoredparts/YmmSearch";
import PublicParts from "@/deleted/ignoredparts/public_parts";

interface SearchResult {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
}

interface DashboardPageClientProps {
  initialParts: any[];
}

export default function DashboardPageClient({ initialParts }: DashboardPageClientProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const displayParts = hasSearched ? searchResults : initialParts;

  return (
    <div className="w-full space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Search component */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Search for parts</h2>
        <YmmSearch
          onSearch={(results: SearchResult[]) => {
            setSearchResults(results);
            setHasSearched(true);
          }}
        />

        {/* Button to reset and show all parts */}
        {hasSearched && (
          <div className="text-center mt-4">
            <button
              onClick={() => setHasSearched(false)}
              className="btn btn-outline px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
            >
              Show all parts
            </button>
          </div>
        )}
      </div>

      {/* Title for displayed parts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {hasSearched ? "Search Results" : "My Published Parts"}
        </h2>

        {/* Displayed parts */}
        {hasSearched && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No results found</p>
          </div>
        ) : displayParts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No parts published</p>
          </div>
        ) : (
          <PublicParts parts={displayParts as any} />
        )}
      </div>
    </div>
  );
}
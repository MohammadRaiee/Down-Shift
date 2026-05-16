import React from 'react';
import PartCard from './PartCard';

interface SearchResult {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
}

interface SearchResultsProps {
  results: SearchResult[];
}

/**
 * مكون عرض نتائج البحث
 */
export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">نتائج البحث ({results.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>
    </div>
  );
}


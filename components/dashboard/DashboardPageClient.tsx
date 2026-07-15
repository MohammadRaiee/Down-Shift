"use client";

import { useState } from "react";
import PartForm, { PartFormValues } from "@/deleted/PartForm";
import YmmSearch from "@/deleted/ignoredparts/YmmSearch";
import PublicParts, { PartForUI } from "../../deleted/ignoredparts/public_parts";

interface SearchResult {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
  publisherId?: number;
}

interface DashboardPageClientProps {
  initialParts: any[];
  sellerId: number;
}

export default function DashboardPageClient({ initialParts, sellerId }: DashboardPageClientProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [editingPart, setEditingPart] = useState<PartFormValues | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const displayParts = hasSearched ? searchResults : initialParts;

  return (
    <div className="w-full space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Search component */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Search for parts</h2>
        <YmmSearch
          onSearch={(results: SearchResult[]) => {
            const filtered = results.filter((item) => item.publisherId === sellerId);
            setSearchResults(filtered);
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
          {hasSearched ? 'Search Results' : 'My Published Parts'}
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
          <PublicParts
            parts={displayParts as any}
            showAddToCart={false}
            onEdit={(part: PartForUI) => {
              const firstCar = part.cars?.[0];
              const brandName = firstCar?.carModel?.brand?.name ?? "";
              const modelName = firstCar?.carModel?.name ?? "";
              const years = (part.cars ?? [])
                .map((car) => car.carModel?.year)
                .filter(Boolean) as number[];

              setEditingId(part.id);
              setEditingPart({
                name: part.name ?? "",
                price: String(part.price ?? ""),
                description: part.description ?? "",
                partNumber: part.partNumber ?? "",
                countryOfOrigin: part.countryOfOrigin ?? "",
                quality: part.quality ?? "Good",
                brandName,
                modelName,
                years,
                categoryId: part.categoryId ?? null,
                image: part.image?.[0] ?? null,
              });
            }}
          />
        )}
      </div>

      {editingPart && editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="max-h-[90vh] overflow-y-auto">
            <PartForm
              mode="edit"
              partId={editingId}
              initialValues={editingPart}
              onSuccess={() => {
                setEditingPart(null);
                setEditingId(null);
                window.location.reload();
              }}
              onCancel={() => {
                setEditingPart(null);
                setEditingId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
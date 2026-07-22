"use client";

import PartForm from "@/components/parts/partform";

export default function AddPartPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <PartForm mode="create" />
    </div>
  );
}
import React from 'react';

interface Part {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
}

interface PartCardProps {
  part: Part;
}

/**
 * مكون بطاقة القطعة الفردية
 */
export default function PartCard({ part }: PartCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white">
      {/* اسم القطعة */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
        {part.name}
      </h3>

      {/* رقم القطعة */}
      <p className="text-gray-600 text-sm mb-1">
        <span className="font-medium">رقم القطعة:</span> {part.partNumber}
      </p>

      {/* السعر */}
      <p className="text-lg font-bold text-green-600 mb-2">
        {part.price.toLocaleString('ar-SA')} ر.س
      </p>

      {/* الوصف */}
      {part.description && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {part.description}
        </p>
      )}

      {/* اسم البائع */}
      {part.publisher?.storeName && (
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          البائع: <span className="font-medium">{part.publisher.storeName}</span>
        </div>
      )}
    </div>
  );
}


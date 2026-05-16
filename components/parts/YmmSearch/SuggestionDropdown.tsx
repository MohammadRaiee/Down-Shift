import React from 'react';

interface SuggestionDropdownProps<T> {
  isLoading: boolean;
  suggestions: T[];
  isEmpty: boolean;
  onSelect: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
}

/**
 * مكون القائمة المنسدلة المشترك لعرض الاقتراحات
 */
export function SuggestionDropdown<T extends { id?: number | string }>({
  isLoading,
  suggestions,
  isEmpty,
  onSelect,
  renderItem,
}: SuggestionDropdownProps<T>) {
  return (
    <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
      {isLoading ? (
        <li className="flex items-center justify-center p-4">
          <span className="loading loading-spinner loading-sm"></span>
          <span className="mr-2 text-sm text-gray-600">جاري التحميل...</span>
        </li>
      ) : isEmpty ? (
        <li className="p-2 text-gray-500 text-sm text-center">لا توجد نتائج</li>
      ) : (
        suggestions.map((item, index) => (
          <li
            key={item.id || index}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
            className="p-2 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0"
          >
            {renderItem ? renderItem(item) : String(item)}
          </li>
        ))
      )}
    </ul>
  );
}

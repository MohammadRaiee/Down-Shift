import React from 'react';
import { SuggestionDropdown } from './SuggestionDropdown';

interface YearInputProps {
  value: string;
  suggestions: number[];
  isLoading: boolean;
  isOpen: boolean;
  onChange: (value: string) => void;
  onSelect: (year: number) => void;
  onBlur?: () => void;
}

/**
 * مكون إدخال السنة مع قائمة الاقتراحات
 */
export function YearInput({
  value,
  suggestions,
  isLoading,
  isOpen,
  onChange,
  onBlur,
  // onFocus,
  onSelect,
}: YearInputProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">السنة</label>
      <input
        type="text"
        placeholder="اختر السنة"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="input input-bordered w-full"
      />
      {isOpen && (
        <SuggestionDropdown
          isLoading={isLoading}
          suggestions={suggestions.map(y => ({ id: y, value: y }))}
          onSelect={item => onSelect(item.value)}
          isEmpty={suggestions.length === 0}
          renderItem={item => item.value}
        />
      )}
    </div>
  );
}

import React from 'react';
import { SuggestionDropdown } from './SuggestionDropdown';

interface Brand {
  id: number;
  name: string;
}

interface BrandInputProps {
  value: string;
  suggestions: Brand[];
  isLoading: boolean;
  isOpen: boolean;
  onChange: (value: string) => void;
  onSelect: (brand: Brand) => void;
  renderItem?: (brand: Brand) => React.ReactNode;
  onBlur?: () => void;
}

/**
 * مكون إدخال الماركة (العلامة التجارية) مع قائمة الاقتراحات
 */
export function BrandInput({
  value,
  suggestions,
  isLoading,
  isOpen,
  onChange,
  onSelect,
  renderItem,
  onBlur,
  ...rest
}: BrandInputProps & { onFocus?: () => void }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">الماركة</label>
      <input
        type="text"
        placeholder="ابدأ بكتابة الماركة"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        {...rest}
        className="input input-bordered w-full"
      />
      {isOpen && (
        <SuggestionDropdown
          isLoading={isLoading}
          suggestions={suggestions}
          onSelect={onSelect}
          isEmpty={suggestions.length === 0}
          renderItem={renderItem}
        />
      )}
    </div>
  );
}

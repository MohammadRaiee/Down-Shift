 import React from 'react';
import { SuggestionDropdown } from './SuggestionDropdown';

interface Model {
  id: number;
  name: string;
  year?: number;
}

interface ModelInputProps {
  value: string;
  suggestions: Model[];
  isLoading: boolean;
  isOpen: boolean;
  isDisabled: boolean;
  onChange: (value: string) => void;
  onSelect: (model: Model) => void;  onBlur?: () => void;}

/**
 * مكون إدخال الموديل مع قائمة الاقتراحات
 * يكون معطلاً حتى يتم اختيار ماركة
 */
export function ModelInput({
  value,
  suggestions,
  isLoading,
  isOpen,
  isDisabled,
  onChange,
  onBlur,
  onSelect,
}: ModelInputProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">الموديل</label>
      <input
        type="text"
        placeholder={isDisabled ? 'اختر الماركة أولاً' : 'ابدأ بكتابة الموديل'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={isDisabled}
        className="input input-bordered w-full disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isOpen && !isDisabled && (
        <SuggestionDropdown
          isLoading={isLoading}
          suggestions={suggestions}
          onSelect={onSelect}
          isEmpty={suggestions.length === 0}
          renderItem={(item) => (
            <>
              {item.name} <span className="text-gray-500 text-sm">({item.year})</span>
            </>
          )}
        />
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFetchSuggestions, useDebouncedValue } from '@/hooks';
// import { YearInput, BrandInput, ModelInput, SearchResults } from './YmmSearch';
import {ModelInput} from './YmmSearch/ModelInput'
import {BrandInput} from './YmmSearch/BrandInput' 
import {YearInput} from './YmmSearch/YearInput'
import {SearchResults} from './YmmSearch/SearchResults'

/** أنواع البيانات المستخدمة في المكون */
interface SearchFormState {
  year: string;
  make: string;
  model: string;
  selectedBrandId: number | null;
}

interface SearchResult {
  id: string;
  name: string;
  partNumber: string;
  price: number;
  description?: string;
  publisher?: { storeName: string };
}

interface SuggestionDataItem {
  id: number;
  name: string;
  year?: number;
}

const CLOSE_DROPDOWN_DELAY = 100;
const DEBOUNCE_DELAY = 300;

interface YmmSearchProps {
  onSearch?: (results: SearchResult[]) => void;
}

/**
 * مكون YmmSearch: محرك بحث شامل عن قطع السيارات
 * يوفر البحث حسب (السنة، الماركة، الموديل)
 */
export default function YmmSearch({ onSearch }: YmmSearchProps) {
  // حالات البحث الأساسية
  const [formState, setFormState] = useState<SearchFormState>({
    year: '',
    make: '',
    model: '',
    selectedBrandId: null,
  });

  // حالات البيانات المرجعية
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // حالات عرض القوائم المنسدلة
  const [showDropdowns, setShowDropdowns] = useState({
    year: false,
    brand: false,
    model: false,
  });

  // المراجع والـ Debouncing
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedMake = useDebouncedValue(formState.make, DEBOUNCE_DELAY);
  const debouncedModel = useDebouncedValue(formState.model, DEBOUNCE_DELAY);


let brandLoading
  
  const {
    suggestions: brandSuggestions,
    loading: BrandLoading,
  } = useFetchSuggestions('brands', debouncedMake, undefined, {
    allowEmptyQuery: true,
    limit: debouncedMake.trim() === '' ? 5 : undefined,
  });

  const ifInclude = (formState.make.trim() ? brandSuggestions.map((S)=> S.name.toLowerCase().includes(formState.make.trim().toLowerCase()) ? 'YES' : 'NO') : ["No"]).includes('YES')


 brandLoading = ifInclude ? false : BrandLoading

  const {
    suggestions: modelSuggestions,
    loading: modelLoading,
  } = useFetchSuggestions(
    'models',
    debouncedModel,
    formState.selectedBrandId
  );

  const {
    suggestions: yearSuggestions,
    loading: yearLoading,
  } = useFetchSuggestions('years', '', formState.selectedBrandId);

  // تنظيف Timeout عند فك التحميل
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  /**
   * إغلاق القائمة المنسدلة بتأخير لتجنب إعادة الفتح
   */
  const closeDropdownWithDelay = useCallback((dropdownName: keyof typeof showDropdowns) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setShowDropdowns(prev => ({ ...prev, [dropdownName]: false }));
    }, CLOSE_DROPDOWN_DELAY);
  }, []);

  /**
   * معالجة اختيار العلامة التجارية
   */
  const handleSelectBrand = useCallback((brand: SuggestionDataItem) => {
    setFormState(prev => ({
      ...prev,
      make: brand.name,
      selectedBrandId: brand.id,
      model: '', // إعادة تعيين الموديل
    }));
    setShowDropdowns(prev => ({ ...prev, brand: false }));
  }, []);

  /**
   * معالجة اختيار الموديل
   */
  const handleSelectModel = useCallback((modelItem: SuggestionDataItem) => {
    setFormState(prev => ({
      ...prev,
      model: modelItem.name,
    }));
    closeDropdownWithDelay('model');
  }, [closeDropdownWithDelay]);

  /**
   * معالجة اختيار السنة
   */
  const handleSelectYear = useCallback((year: number) => {
    setFormState(prev => ({
      ...prev,
      year: String(year),
    }));
    closeDropdownWithDelay('year');
  }, [closeDropdownWithDelay]);

  /**
   * معالجة تغيير حقل الإدخال
   */
  const handleInputChange = useCallback((field: keyof SearchFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * معالجة البحث عن القطع
   */
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة الإدخال
    if (!formState.year || !formState.make || !formState.model) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams({
        year: formState.year,
        make: formState.make,
        model: formState.model,
      });

      const response = await fetch(`/api/parts/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء البحث');
      }

      setResults(data);
      
      // استدعاء callback إذا كان موجوداً
      if (onSearch) {
        onSearch(data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [formState, onSearch]);

  // دالة لإغلاق جميع القوائم المنسدلة
  const closeAllDropdowns = useCallback(() => {
    setShowDropdowns({ year: false, brand: false, model: false });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSearch}
        className="space-y-4"
      >
        {/* حقل السنة */}
        <YearInput
          value={formState.year}
          suggestions={yearSuggestions}
          isLoading={yearLoading}
          isOpen={showDropdowns.year}
          onChange={(value) => {
            handleInputChange('year', value);
            setShowDropdowns(prev => ({ ...prev, year: true }));
          }}
          onBlur={() => setTimeout(() => setShowDropdowns(prev => ({ ...prev, year: false })), 50)}
          onSelect={handleSelectYear}
        />

        {/* حقل الماركة */}
        <BrandInput
          value={formState.make}
          suggestions={brandSuggestions}
          isLoading={brandLoading}
          isOpen={showDropdowns.brand}
          onChange={(value) => {
            // إذا كان المستخدم يكتب نفس الاسم الموجود بالفعل، لا تعيد تعيين selectedBrandId
            if (value.trim() === formState.make.trim()) return;
            console.log(brandSuggestions);
            const found = brandSuggestions.find(b => b.name.trim().includes(value.trim()));
            console.log('Brand input changed:', value, 'Found brand:', found);
            setFormState(prev => ({
              ...prev,
              make: value,
              selectedBrandId: found ? found.id : null,
              model: found ? prev.model : '',
            }));
            setShowDropdowns(prev => ({ ...prev, brand: true }));
          }}
          {...{onFocus: () => setShowDropdowns(prev => ({ ...prev, brand: true }))}}
          onSelect={handleSelectBrand}
          onBlur={() => setTimeout(() => setShowDropdowns(prev => ({ ...prev, brand: false })), 50)}
          renderItem={item => item.name}
        />

        {/* حقل الموديل */}
        <ModelInput
          value={formState.model}
          suggestions={modelSuggestions}
          isLoading={modelLoading}
          isOpen={showDropdowns.model}
          isDisabled={!formState.selectedBrandId}
          onChange={(value) => {
            handleInputChange('model', value);
            setShowDropdowns(prev => ({ ...prev, model: true }));
          }}
          onBlur={() => setTimeout(() => setShowDropdowns(prev => ({ ...prev, model: false })), 50)}
          onSelect={handleSelectModel}
        />

        {/* زر البحث */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading || !formState.year || !formState.make || !formState.model}
        >
          {loading ? 'جاري البحث...' : 'بحث عن القطع'}
        </button>
      </form>

      {/* رسالة الخطأ */}
      {error && (
        <div className="text-red-500 mt-4 p-2 bg-red-50 rounded" role="alert">
          {error}
        </div>
      )}

      {/* نتائج البحث */}
      {/* <SearchResults results={results} /> */}
    </div>
  );
}

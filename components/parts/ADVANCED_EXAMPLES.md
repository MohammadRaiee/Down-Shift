# أمثلة الاستخدام المتقدمة

## الاستخدام الأساسي

### استيراد بسيط
```tsx
import YmmSearch from '@/components/parts/YmmSearch';

export default function Page() {
  return <YmmSearch />;
}
```

---

## الاستخدام المتقدم

### 1. استخدام مكون مخصص مع Hooks

```tsx
import { useFetchSuggestions, useDebouncedValue } from '@/hooks';
import { BrandInput } from '@/components/parts/YmmSearch';

export function CustomBrandSearch() {
  const [brandInput, setBrandInput] = useState('');
  const debouncedBrand = useDebouncedValue(brandInput, 300);
  
  const { suggestions: brands, loading } = useFetchSuggestions(
    'brands',
    debouncedBrand
  );

  return (
    <BrandInput
      value={brandInput}
      suggestions={brands}
      isLoading={loading}
      isOpen={true}
      onChange={setBrandInput}
      onSelect={(brand) => {
        console.log('Selected:', brand);
      }}
    />
  );
}
```

### 2. دمج مع State Management (Redux/Context)

```tsx
import { useDispatch, useSelector } from 'react-redux';
import YmmSearch from '@/components/parts/YmmSearch';

export function SearchWithRedux() {
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.search.results);

  const handleSearch = (results) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  };

  return (
    <div>
      <YmmSearch />
      {/* استخدام النتائج من Redux */}
      {searchResults.map(result => (
        <div key={result.id}>{result.name}</div>
      ))}
    </div>
  );
}
```

### 3. مع React Query للـ Caching

```tsx
import { useQuery } from '@tanstack/react-query';
import { useFetchSuggestions } from '@/hooks';

export function SearchWithReactQuery() {
  const [make, setMake] = useState('');
  
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['brands', make],
    queryFn: () => fetch(`/api/parts/suggestions?type=brands&query=${make}`)
      .then(r => r.json()),
    enabled: make.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div>
      {/* استخدام البيانات المخزنة في الـ cache */}
    </div>
  );
}
```

### 4. مع Localization (i18n)

```tsx
import { useTranslation } from 'next-i18next';

interface LocalizedYmmSearchProps {
  onSearch: (results: any[]) => void;
}

export function LocalizedYmmSearch({ onSearch }: LocalizedYmmSearchProps) {
  const { t } = useTranslation('parts');

  // يمكن تمرير النصوص المترجمة كـ props إذا لزم الأمر
  return (
    <div>
      <h2>{t('search_title')}</h2>
      {/* ... */}
    </div>
  );
}
```

### 5. مع Analytics/Tracking

```tsx
import { analytics } from '@/lib/analytics';
import YmmSearch from '@/components/parts/YmmSearch';

export function SearchWithAnalytics() {
  const handleSelectBrand = (brand: any) => {
    analytics.track('brand_selected', {
      brand_id: brand.id,
      brand_name: brand.name,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSearch = (results: any[]) => {
    analytics.track('search_completed', {
      results_count: results.length,
      timestamp: new Date().toISOString(),
    });
  };

  return <YmmSearch />;
}
```

### 6. مع Error Boundary

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import YmmSearch from '@/components/parts/YmmSearch';

export function SafeYmmSearch() {
  return (
    <ErrorBoundary
      fallback={<div>حدث خطأ في محرك البحث</div>}
      onError={(error) => console.error('Search Error:', error)}
    >
      <YmmSearch />
    </ErrorBoundary>
  );
}
```

---

## حالات الاستخدام التطبيقية

### حالة 1: صفحة البحث الرئيسية

```tsx
import { useState } from 'react';
import YmmSearch from '@/components/parts/YmmSearch';
import { PartCard } from '@/components/parts/YmmSearch';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [lastSearch, setLastSearch] = useState(null);

  return (
    <main className="container mx-auto my-8">
      <h1>ابحث عن قطع السيارات</h1>
      <YmmSearch />
      
      {lastSearch && (
        <div className="mt-8">
          <h2>آخر بحث: {lastSearch.year} {lastSearch.make} {lastSearch.model}</h2>
          <div className="grid gap-4">
            {results.map(part => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
```

### حالة 2: Widget مدمج

```tsx
import YmmSearch from '@/components/parts/YmmSearch';

export function EmbeddedSearchWidget() {
  return (
    <aside className="bg-gray-50 p-4 rounded-lg">
      <h3>ابحث عن القطع</h3>
      <YmmSearch />
    </aside>
  );
}
```

### حالة 3: مع Pagination

```tsx
import { useState } from 'react';
import YmmSearch from '@/components/parts/YmmSearch';

export function SearchWithPagination() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [results, setResults] = useState([]);

  const paginatedResults = results.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div>
      <YmmSearch />
      
      {/* نتائج مع pagination */}
      <div className="grid gap-4">
        {paginatedResults.map(/* ... */)}
      </div>

      {/* أزرار الصفحات */}
      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: Math.ceil(results.length / perPage) }).map(
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? 'btn btn-primary' : 'btn'}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
```

### حالة 4: مع Filtering إضافي

```tsx
import { useState } from 'react';
import YmmSearch from '@/components/parts/YmmSearch';

export function SearchWithFilters() {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    inStock: false,
  });

  const filteredResults = results.filter(part => 
    part.price >= filters.priceMin &&
    part.price <= filters.priceMax &&
    (!filters.inStock || part.stock > 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar للفلاتر */}
      <aside className="md:col-span-1">
        <div className="space-y-4">
          <label>
            السعر المنخفض:
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceMin: Number(e.target.value)
              }))}
            />
          </label>
          {/* فلاتر أخرى */}
        </div>
      </aside>

      {/* محرك البحث والنتائج */}
      <main className="md:col-span-3">
        <YmmSearch />
        {/* النتائج المفلترة */}
      </main>
    </div>
  );
}
```

---

## أمثلة مخصصة مع Hooks

### مثال 1: Hook مخصصة لحفظ البحث

```tsx
function useSearchHistory() {
  const [history, setHistory] = useState<any[]>([]);

  const addSearch = (search) => {
    setHistory(prev => [search, ...prev.slice(0, 9)]);
    localStorage.setItem('searchHistory', JSON.stringify([search, ...history.slice(0, 9)]));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return { history, addSearch, clearHistory };
}

// الاستخدام
export function SearchWithHistory() {
  const { history, addSearch } = useSearchHistory();

  return (
    <div>
      <YmmSearch onSearch={addSearch} />
      {/* عرض السجل */}
    </div>
  );
}
```

### مثال 2: Hook لمقارنة الأسعار

```tsx
function usePriceComparison(results: any[]) {
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    if (results.length > 0) {
      const minPrice = Math.min(...results.map(r => r.price));
      const maxPrice = Math.max(...results.map(r => r.price));
      const avgPrice = results.reduce((acc, r) => acc + r.price, 0) / results.length;

      setComparison({ minPrice, maxPrice, avgPrice });
    }
  }, [results]);

  return comparison;
}
```

---

## نصائح الأداء

### استخدام Memoization

```tsx
import { useMemo } from 'react';

const memoizedResults = useMemo(
  () => results.sort((a, b) => a.price - b.price),
  [results]
);
```

### Virtual Scrolling للقوائم الكبيرة

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={results.length}
  itemSize={100}
>
  {({ index, style }) => (
    <PartCard key={index} part={results[index]} style={style} />
  )}
</FixedSizeList>
```

---

## الاختبارات

### Unit Test مثال

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import YmmSearch from '@/components/parts/YmmSearch';

describe('YmmSearch', () => {
  it('should render search form', () => {
    render(<YmmSearch />);
    expect(screen.getByPlaceholderText('اختر السنة')).toBeInTheDocument();
  });

  it('should handle brand selection', async () => {
    render(<YmmSearch />);
    const input = screen.getByPlaceholderText('ابدأ بكتابة الماركة');
    
    fireEvent.change(input, { target: { value: 'Toyota' } });
    // assertions...
  });
});
```

---

**آخر تحديث**: 2026-04-08

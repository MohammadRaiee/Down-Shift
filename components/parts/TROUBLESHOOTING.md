# استكشاف الأخطاء والحلول

## 🐛 الأخطاء الشائعة والحلول

### خطأ 1: "Cannot find module '@/hooks'"

**السبب**: الـ path alias غير مكون بشكل صحيح

**الحل**:
```json
// tsconfig.json أو jsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### خطأ 2: "useFetchSuggestions is not a function"

**السبب**: استيراد غير صحيح

**❌ خطأ**:
```tsx
import useFetchSuggestions from '@/hooks/useFetchSuggestions';
```

**✅ صحيح**:
```tsx
import { useFetchSuggestions } from '@/hooks';
```

---

### خطأ 3: "Type 'any[]' is not assignable to type 'Suggestion[]'"

**السبب**: عدم تحديد النوع الصحيح

**❌ خطأ**:
```tsx
const { suggestions } = useFetchSuggestions('brands', debouncedMake);
// suggestions هنا من نوع any[]
```

**✅ صحيح**:
```tsx
interface Suggestion {
  id: number;
  name: string;
}

const { suggestions }: { suggestions: Suggestion[] } = useFetchSuggestions('brands', debouncedMake);
```

---

### خطأ 4: "Dropdown closes immediately after selection"

**السبب**: عدم انتظار الـ timeout بشكل صحيح

**الحل**: تم معالجة هذا في `YmmSearch.tsx` باستخدام `closeTimeoutRef`

```tsx
const closeDropdownWithDelay = useCallback((dropdownName) => {
  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  closeTimeoutRef.current = setTimeout(() => {
    setShowDropdowns(prev => ({ ...prev, [dropdownName]: false }));
  }, CLOSE_DROPDOWN_DELAY);
}, []);
```

---

### خطأ 5: "API calls happening too frequently"

**السبب**: عدم استخدام debouncing

**الحل**: استخدام `useDebouncedValue`

```tsx
// قبل
const { suggestions } = useFetchSuggestions('brands', formState.make);

// بعد
const debouncedMake = useDebouncedValue(formState.make, DEBOUNCE_DELAY);
const { suggestions } = useFetchSuggestions('brands', debouncedMake);
```

---

### خطأ 6: "Memory leak warning"

**السبب**: عدم تنظيف Timeout

**الحل**:
```tsx
useEffect(() => {
  return () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };
}, []);
```

---

### خطأ 7: "Model field is always disabled"

**السبب**: `selectedBrandId` لم يتم تحديثه

**الحل**:
```tsx
const handleSelectBrand = useCallback((brand: SuggestionDataItem) => {
  setFormState(prev => ({
    ...prev,
    make: brand.name,
    selectedBrandId: brand.id, // ✅ تأكد من تحديث هذا
    model: '',
  }));
  closeDropdownWithDelay('brand');
}, [closeDropdownWithDelay]);
```

---

### خطأ 8: "Search button stays disabled even after filling fields"

**السبب**: شروط التعطيل غير صحيحة

**الحل**:
```tsx
<button
  type="submit"
  disabled={
    loading || 
    !formState.year || 
    !formState.make || 
    !formState.model // ✅ تأكد من جميع الحقول
  }
>
  بحث عن القطع
</button>
```

---

## 🔍 استكشاف الأخطاء المتقدمة

### المشكلة: الاستعلامات في الـ URL غير محركة بشكل صحيح

**الحل**:
```tsx
// قبل
const res = await fetch(
  `/api/parts/search?year=${encodeURIComponent(year)}&make=${encodeURIComponent(make)}`
);

// بعد (أفضل)
const params = new URLSearchParams({
  year: formState.year,
  make: formState.make,
  model: formState.model,
});
const response = await fetch(`/api/parts/search?${params}`);
```

---

### المشكلة: الخطأ في إغلاق القائمة

**الحل الشامل**:
```tsx
// 1. في المكون الرئيسي - إدارة الـ refs
const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// 2. Function للإغلاق
const closeDropdownWithDelay = useCallback((dropdownName) => {
  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  closeTimeoutRef.current = setTimeout(() => {
    setShowDropdowns(prev => ({ ...prev, [dropdownName]: false }));
  }, CLOSE_DROPDOWN_DELAY);
}, []);

// 3. Cleanup في useEffect
useEffect(() => {
  return () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };
}, []);

// 4. استخدام في handlers
const handleSelectBrand = useCallback((brand) => {
  setFormState(prev => ({
    ...prev,
    make: brand.name,
    selectedBrandId: brand.id,
    model: '',
  }));
  closeDropdownWithDelay('brand'); // ✅ استخدم الـ function
}, [closeDropdownWithDelay]);
```

---

## 📊 تتبع المشاكل

### مثال: تسجيل أخطاء API

```tsx
const handleSearch = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();

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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search API Error:', {
        status: response.status,
        message: errorData.error,
        params: Object.fromEntries(params),
      });
      throw new Error(errorData.error || 'حدث خطأ أثناء البحث');
    }

    const data = await response.json();
    setResults(data);
  } catch (err: any) {
    console.error('Search error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [formState]);
```

---

## ⚙️ تصحيح الأداء

### مشكلة: تحديثات متكررة

**المراقبة**:
```tsx
useEffect(() => {
  console.log('formState changed:', formState);
}, [formState]);
```

**الحل**:
```tsx
// استخدم callbacks بدلاً من إعادة إنشاء الدوال
const handleInputChange = useCallback((field, value) => {
  setFormState(prev => ({
    ...prev,
    [field]: value,
  }));
}, []);
```

---

### مشكلة: Infinite loops

**المراقبة**:
```tsx
// ✅ dependency array صحيح
useEffect(() => {
  // ...
}, [debouncedValue, brandId]); // وليس [value] لأنه سيتغير كل frame
```

---

## 🧪 أدوات التصحيح

### استخدام React DevTools

```tsx
// أضف هذا للتطوير فقط
if (process.env.NODE_ENV === 'development') {
  console.log('YmmSearch State:', {
    formState,
    showDropdowns,
    loading: { brandLoading, modelLoading, yearLoading },
  });
}
```

---

### استخدام Chrome DevTools Network Tab

1. افتح DevTools (F12)
2. اذهب إلى Network tab
3. فعّل الـ throttling (3G slow) للاختبار
4. لاحظ عدد الـ API calls
5. تأكد من الـ debouncing يعمل

---

## ✅ قائمة التحقق للمشاكل

- [ ] جميع الاستيرادات صحيحة؟
- [ ] Refs تنظف بشكل صحيح؟
- [ ] Timeouts تم إلغاؤها عند فك التحميل؟
- [ ] Dependencies arrays صحيحة؟
- [ ] API URLs محركة بشكل صحيح؟
- [ ] Error handling موجود؟
- [ ] Type definitions محددة؟
- [ ] Debouncing فعّال؟

---

## 📞 الحصول على مساعدة

### لـ Debugging أفضل:

1. **استخدم React DevTools Profiler**
   - سجل الـ renders
   - حدد الـ re-renders غير الضرورية

2. **استخدم Network throttling**
   - اختبر مع اتصال بطيء
   - تأكد من loading states

3. **استخدم console.time()**
   ```tsx
   console.time('API_CALL');
   // API call here
   console.timeEnd('API_CALL');
   ```

4. **أنشئ simple reproducible example**
   - انسخ المشكلة في sandbox بسيط
   - سهل الـ debugging

---

**تم التحديث**: 2026-04-08

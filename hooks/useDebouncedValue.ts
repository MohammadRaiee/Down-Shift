import { useEffect, useState } from 'react';

/**
 * Hook للـ Debouncing
 * يؤخر تحديث القيمة حتى يتوقف المستخدم عن الكتابة
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // تعيين timeout للتحديث المتأخر
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // تنظيف الـ timeout السابق
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

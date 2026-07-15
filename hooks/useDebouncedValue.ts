import { useEffect, useState } from 'react';

/**
 * Debounce hook
 * Delays updating the value until the user stops typing
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout for the delayed update
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the previous timeout
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
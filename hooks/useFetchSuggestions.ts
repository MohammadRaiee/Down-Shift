import { useState, useEffect } from 'react';

/**
 * Hook مخصص لجلب الاقتراحات من API
 * يدعم الجلب بناءً على النوع والاستعلام والمعاملات الإضافية
 */
type FetchSuggestionsOptions = {
  limit?: number;
  allowEmptyQuery?: boolean;
};

export function useFetchSuggestions(
  type: 'brands' | 'models' | 'years',
  query: string,
  brandId?: number | null,
  options: FetchSuggestionsOptions = {},
) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { limit, allowEmptyQuery } = options;

  useEffect(() => {
    // عدم الجلب إذا كانت معاملات البحث غير كافية
    if (type === 'years' && !brandId) {
      setSuggestions([]);
      return;
    }

    const hasQuery = query.trim().length > 0;

    if ((type === 'brands' || type === 'models') && !hasQuery && !allowEmptyQuery) {
      setSuggestions([]);
      return;
    }

    if (type === 'models' && !hasQuery && allowEmptyQuery && !brandId) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        // بناء معاملات الاستعلام
        const params = new URLSearchParams();
        params.append('type', type);

        if (query) params.append('query', query);
        if (brandId) params.append('brandId', String(brandId));
        if (limit) params.append('limit', String(limit));

        const response = await fetch(`/api/parts/suggestions?${params}`);

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        setSuggestions(data || []);
      } catch (err: any) {
        console.error(`Error fetching ${type} suggestions:`, err);
        setError(err.message);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [type, query, brandId, limit, allowEmptyQuery]);

  return { suggestions, loading, error };
}

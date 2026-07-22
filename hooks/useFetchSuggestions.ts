import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch suggestions from an API
 * Supports fetching based on type, query, and additional parameters
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
    // Skip fetching if search parameters are insufficient
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
        // Build query parameters
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
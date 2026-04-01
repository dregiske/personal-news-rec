import { fetchSaved } from '../api';
import { useFetch } from '../../../hooks/useFetch';

export function useSavedIds() {
  const { data, loading, error } = useFetch<Set<number>>(
    () => fetchSaved().then((saved) => new Set(saved.map((s) => s.article_id))),
    [],
    'Failed to load saved articles.',
  );
  return { savedIds: data ?? new Set<number>(), loading, error };
}

import { useEffect, useState } from 'react';

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
  errorMessage = 'Failed to load.',
): { data: T | null; loading: boolean; error: string } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    fetcher()
      .then((result) => { if (isMounted) setData(result); })
      .catch(() => { if (isMounted) setError(errorMessage); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

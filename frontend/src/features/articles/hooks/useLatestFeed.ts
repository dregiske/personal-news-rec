import { useEffect, useState } from 'react';
import { fetchFeed, fetchFeedByTopic } from '../api';
import type { Article } from '../../../types';

export function useLatestFeed(topic: string | null) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const request = topic ? fetchFeedByTopic(topic) : fetchFeed();

    request
      .then((data) => { if (isMounted) setArticles(data); })
      .catch(() => { if (isMounted) setError('Failed to load latest news.'); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [topic]);

  return { articles, loading, error };
}

import { useEffect, useState } from 'react';
import { fetchFeed, fetchForYou, fetchFeedByTopic, fetchUserStats } from '../api';
import type { Article } from '../../../types';

export function usePersonalizedFeed(topic: string | null) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const request = topic
      ? fetchFeedByTopic(topic)
      : fetchUserStats().then((stats) => (stats.is_personalized ? fetchForYou() : fetchFeed()));

    request
      .then((data) => { if (isMounted) setArticles(data); })
      .catch(() => { if (isMounted) setError('Failed to load your feed.'); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [topic]);

  return { articles, loading, error };
}

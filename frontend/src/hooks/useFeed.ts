import { useEffect, useState } from 'react';
import { fetchFeed, fetchForYou } from '../api/feed';
import { fetchUserStats } from '../api/stats';
import type { Article } from '../types';

interface UseFeedResult {
  articles: Article[];
  loading: boolean;
  error: string;
}

export function useFeed(): UseFeedResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const stats = await fetchUserStats();
        const data = stats.is_personalized ? await fetchForYou() : await fetchFeed();
        if (isMounted) setArticles(data);
      } catch (err) {
        console.error('Error loading feed:', err);
        if (isMounted) setError('Failed to load feed. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, []);

  return { articles, loading, error };
}

import { useEffect, useState } from 'react';
import { fetchFeed, fetchFeedByTopic, fetchForYou } from '../api/feed';
import { fetchUserStats } from '../api/stats';
import { fetchSaved } from '../api/saved';
import type { Article } from '../types';

interface UseFeedResult {
  articles: Article[];
  savedIds: Set<number>;
  loading: boolean;
  error: string;
}

export function useFeed(activeTopic?: string): UseFeedResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    async function load() {
      try {
        const [stats, saved] = await Promise.all([fetchUserStats(), fetchSaved()]);

        let data: Article[];
        if (activeTopic) {
          data = await fetchFeedByTopic(activeTopic);
        } else {
          data = stats.is_personalized ? await fetchForYou() : await fetchFeed();
        }

        if (isMounted) {
          setArticles(data);
          setSavedIds(new Set(saved.map((s) => s.article_id)));
        }
      } catch (err) {
        console.error('Error loading feed:', err);
        if (isMounted) setError('Failed to load feed. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [activeTopic]);

  return { articles, savedIds, loading, error };
}

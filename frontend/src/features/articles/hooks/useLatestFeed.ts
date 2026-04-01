import { fetchFeed, fetchFeedByTopic } from '../api';
import { useFetch } from '../../../hooks/useFetch';
import type { Article } from '../../../types';

export function useLatestFeed(topic: string | null) {
  const { data, loading, error } = useFetch<Article[]>(
    () => (topic ? fetchFeedByTopic(topic) : fetchFeed()),
    [topic],
    'Failed to load latest news.',
  );
  return { articles: data ?? [], loading, error };
}

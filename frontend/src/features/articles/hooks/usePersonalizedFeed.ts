import { fetchFeed, fetchForYou, fetchFeedByTopic, fetchUserStats } from '../api';
import { useFetch } from '../../../hooks/useFetch';
import type { Article } from '../../../types';

export function usePersonalizedFeed(topic: string | null) {
  const { data, loading, error } = useFetch<Article[]>(
    () => topic
      ? fetchFeedByTopic(topic)
      : fetchUserStats().then((stats) => (stats.is_personalized ? fetchForYou() : fetchFeed())),
    [topic],
    'Failed to load your feed.',
  );
  return { articles: data ?? [], loading, error };
}

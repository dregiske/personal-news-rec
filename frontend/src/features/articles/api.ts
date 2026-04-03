import api, { API_BASE } from '../../api/api';
import type { Article, InteractionType, UserStats } from '../../types';

// Feed
export async function fetchFeed(): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/latest`);
  return result.data;
}

export async function fetchFeedByTopic(topic: string): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/topics/${topic}`);
  return result.data;
}

export async function fetchForYou(): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/for-you`);
  return result.data;
}

// Interactions
export async function recordInteraction(articleId: number, type: InteractionType): Promise<void> {
  await api.post(`${API_BASE}/interactions`, { article_id: articleId, type });
}

export async function deleteInteraction(articleId: number): Promise<void> {
  await api.delete(`${API_BASE}/interactions/${articleId}`);
}

// Stats
export async function fetchUserStats(): Promise<UserStats> {
  const res = await api.get<UserStats>(`${API_BASE}/me/stats`);
  return res.data;
}

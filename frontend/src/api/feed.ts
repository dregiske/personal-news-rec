import api, { API_BASE } from './api';
import type { Article } from '../types';
import { FEED_DEFAULT_LIMIT } from '../constants';

export async function fetchFeed(): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed`);
  return result.data;
}

export async function fetchFeedByTopic(topic: string, limit = FEED_DEFAULT_LIMIT): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/topics/${topic}`, {
    params: { limit },
  });
  return result.data;
}

export async function fetchForYou(limit = FEED_DEFAULT_LIMIT): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/for-you`, {
    params: { limit },
  });
  return result.data;
}

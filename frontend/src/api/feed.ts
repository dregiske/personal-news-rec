import api, { API_BASE } from './api';
import type { Article } from '../types';

export async function fetchFeed(): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed`);
  return result.data;
}

export async function fetchForYou(limit = 20): Promise<Article[]> {
  const result = await api.get<Article[]>(`${API_BASE}/feed/for-you`, {
    params: { limit },
  });
  return result.data;
}

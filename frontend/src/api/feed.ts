import api from './api';
import type { Article } from '../types';

export async function fetchFeed(): Promise<Article[]> {
  const result = await api.get<Article[]>('/api/v1/feed');
  return result.data;
}
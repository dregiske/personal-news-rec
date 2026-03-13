import api from './api';
import type { Article } from '../types';

export async function fetchForYou(limit = 20): Promise<Article[]> {
  const result = await api.get<Article[]>('/feed/for-you', {
    params: { limit },
  });
  return result.data;
}
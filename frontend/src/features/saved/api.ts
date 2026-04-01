import api, { API_BASE } from '../../api/api';
import type { SavedArticle } from '../../types';

export async function fetchSaved(): Promise<SavedArticle[]> {
  const res = await api.get<SavedArticle[]>(`${API_BASE}/me/saved`);
  return res.data;
}

export async function saveArticle(articleId: number): Promise<SavedArticle> {
  const res = await api.post<SavedArticle>(`${API_BASE}/me/saved/${articleId}`);
  return res.data;
}

export async function unsaveArticle(articleId: number): Promise<void> {
  await api.delete(`${API_BASE}/me/saved/${articleId}`);
}

import api, { API_BASE } from "./api";
import type { Article } from "../types";

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

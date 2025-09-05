import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // send/receive cookies
});

export type Article = {
  id: number;
  title: string;
  url: string;
  source: string;
  summary?: string;
  image_url?: string;
  published_at: string;   // ISO
  topics?: string[];
};

export type FeedResponse = {
  items: Article[];
  next_cursor?: string;
};

export async function fetchFeed(cursor?: string, limit = 20) {
  const { data } = await api.get<FeedResponse>("/api/feed", { params: { cursor, limit }});
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post("/login", { email, password });
  return data;
}

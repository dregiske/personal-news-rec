import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // allow cookies (JWT)
});

export async function fetchFeed(cursor, limit = 20) {
  const { data } = await api.get("/api/feed", { params: { cursor, limit } });
  return data; // { items: [...], next_cursor? }
}

export async function login(email, password) {
  const { data } = await api.post("/login", { email, password });
  return data;
}
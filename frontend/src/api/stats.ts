import api, { API_BASE } from "./api";
import type { UserStats } from "../types";

export async function fetchUserStats(): Promise<UserStats> {
  const res = await api.get<UserStats>(`${API_BASE}/me/stats`);
  return res.data;
}

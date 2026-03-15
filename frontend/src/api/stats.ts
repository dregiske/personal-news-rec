import api from './api';
import type { UserStats } from '../types';

export async function fetchUserStats(): Promise<UserStats> {
  const res = await api.get<UserStats>('/api/v1/me/stats');
  return res.data;
}
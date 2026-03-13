import api from './api';
import type { UserStats } from '../types';

export async function fetchUserStats(): Promise<UserStats> {
  const res = await api.get<UserStats>('/me/stats');
  return res.data;
}
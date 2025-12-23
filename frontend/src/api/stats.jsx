import api from './api';

export async function fetchUserStats() {
  const res = await api.get('/me/stats');
  return res.data;
}
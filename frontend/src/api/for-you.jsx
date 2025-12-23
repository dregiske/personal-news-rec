import api from './api';

export async function fetchForYou(limit = 20) {
  const result = await api.get('/feed/for-you', {
	params: { limit }
  });
  return result.data;
}
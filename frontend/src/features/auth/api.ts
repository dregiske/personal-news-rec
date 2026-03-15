import api from '../../api/api';
import type { LoginResponse } from '../../types';

export async function signup({ email, password }: { email: string; password: string }): Promise<void> {
  await api.post('/api/v1/signup', { email, password });
}

export async function login({ email, password }: { email: string; password: string }): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/api/v1/login', { email, password });
  return res.data;
}

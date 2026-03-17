import api, { API_BASE } from '../../api/api';
import type { LoginResponse, User } from '../../types';

export async function signup({ email, password }: { email: string; password: string }): Promise<void> {
  await api.post(`${API_BASE}/signup`, { email, password });
}

export async function login({ email, password }: { email: string; password: string }): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>(`${API_BASE}/login`, { email, password });
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post(`${API_BASE}/logout`);
}

export async function fetchMe(): Promise<User | null> {
  try {
    const res = await api.get<User>(`${API_BASE}/me`);
    return res.data;
  } catch {
    return null;  // no active session
  }
}

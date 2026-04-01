import api, { API_BASE } from '../../api/api';
import type { User } from '../../types';

export async function updateProfile(data: { username?: string; preferred_topics?: string; language?: string }): Promise<User> {
  const res = await api.patch<User>(`${API_BASE}/me`, data);
  return res.data;
}

export async function changePassword(current_password: string, new_password: string): Promise<void> {
  await api.patch(`${API_BASE}/me/password`, { current_password, new_password });
}

export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post<User>(`${API_BASE}/me/avatar`, form);
  return res.data;
}

export async function deleteAvatar(): Promise<User> {
  const res = await api.delete<User>(`${API_BASE}/me/avatar`);
  return res.data;
}

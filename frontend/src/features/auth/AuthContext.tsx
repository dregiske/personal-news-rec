import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginApi } from './api';
import type { User } from '../../types';

type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string): Promise<LoginResult> {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      localStorage.setItem('access_token', data.access_token);
      setUser(data.user);
      return { ok: true };
    } catch (err: unknown) {
      console.error(err);
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Login failed';
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('access_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

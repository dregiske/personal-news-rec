import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, logout as logoutApi, fetchMe } from './api';
import type { User } from '../../types';

type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from existing httpOnly cookie on mount
  useEffect(() => {
    fetchMe().then((me) => {
      setUser(me);
      setLoading(false);
    });
  }, []);

  async function login(email: string, password: string): Promise<LoginResult> {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
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

  async function logout() {
    await logoutApi();
    setUser(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
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

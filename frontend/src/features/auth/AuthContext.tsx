import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, logout as logoutApi, fetchMe } from "./api";
import { extractError } from "../../api/api";
import type { User } from "../../types";

type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      const message = extractError(err, "Login failed");
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await logoutApi();
    setUser(null);
    navigate("/");
  }

  async function refreshUser() {
    const me = await fetchMe();
    if (me) setUser(me);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

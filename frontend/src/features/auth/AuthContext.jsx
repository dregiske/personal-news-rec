// src/features/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi } from "./api";
// optional: import getMe() later to fetch current user from backend

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // { id, email } or null
  const [loading, setLoading] = useState(false);

  // optional: on mount, hit a /me endpoint to see if user is already logged in
  useEffect(() => {
    // TODO: call /me later
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setUser(data.user);
      // cookie gets set by backend, we just store user info
      return { ok: true, data };
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || "Login failed";
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    // optional: call backend /logout first
    setUser(null);
  }

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

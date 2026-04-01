import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";
import Unauthorized from "../../pages/errors/Unauthorized";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Unauthorized />;
  }

  return children;
}

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PromptCard from "../../components/PromptCard";
import { APP_SHORT_NAME } from "../../constants";
import { formInput, formLabel, formError, btnPrimary } from "../../styles";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const result = await login(email, password);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="mt-15 min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <PromptCard
        title="Welcome back."
        subtitle={`Sign in to your ${APP_SHORT_NAME} account.`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className={formLabel}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={formInput}
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={formLabel}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={formInput}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full ${btnPrimary}`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {message && <p className={`${formError} mt-4`}>{message}</p>}

        <p className="text-xs text-fray-text-faint mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-fray-primary hover:text-fray-primary-hover transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </PromptCard>
    </div>
  );
}

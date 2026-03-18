import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const result = await login(email, password);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div className="mt-15 min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-fray-text mb-1">Welcome back.</h1>
        <p className="text-sm text-fray-text-faint mb-8">Sign in to your Fray account.</p>

        <div className="bg-fray-glass border border-fray-border backdrop-blur-md p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint">Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-fray-input-bg border border-fray-border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint">Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-fray-input-bg border border-fray-border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-4 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {message && <p className="text-xs text-fray-danger mt-4">{message}</p>}

          <p className="text-xs text-fray-text-faint mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-fray-primary hover:text-fray-text transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

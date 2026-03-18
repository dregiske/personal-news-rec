import { useState } from 'react';
import { signup } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsError(false);
    setMessage('Creating account...');

    try {
      await signup({ email, password });
      const result = await login(email, password);
      if (!result.ok) {
        setIsError(true);
        setMessage('Account created, but login failed. Redirecting to login...');
        navigate('/login');
        return;
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Signup failed';
      setIsError(true);
      setMessage(msg);
    }
  }

  return (
    <div className="mt-15 min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-fray-text mb-1">Join the Fray.</h1>
        <p className="text-sm text-fray-text-faint mb-8">Create your account to get started.</p>

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
              className="mt-2 px-4 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200"
            >
              Create Account
            </button>
          </form>

          {message && (
            <p className={`text-xs mt-4 ${isError ? 'text-fray-danger' : 'text-fray-text-faint'}`}>
              {message}
            </p>
          )}

          <p className="text-xs text-fray-text-faint mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-fray-primary hover:text-fray-text transition-colors duration-200">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

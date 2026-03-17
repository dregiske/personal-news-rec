import { useState } from 'react';
import type { CSSProperties } from 'react';
import { signup } from './api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PageLayout from '../../components/PageLayout';
import { button, card, errorText } from '../../styles/common';
import { colors, font, spacing } from '../../styles/theme';

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
    <PageLayout title="Sign Up">
      <div style={card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>

          <button type="submit" style={button}>Create Account</button>
        </form>

        {message && <p style={isError ? errorText : styles.info}>{message}</p>}

        <p style={styles.switchLink}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </PageLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  field: {
    marginBottom: spacing.md,
    textAlign: 'left',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    fontSize: font.base,
    color: colors.text,
  },
  input: {
    width: '100%',
    padding: `8px ${spacing.sm}`,
    fontSize: font.base,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  info: {
    marginTop: spacing.sm,
    fontSize: font.sm,
    color: colors.muted,
  },
  switchLink: {
    marginTop: spacing.md,
    fontSize: font.sm,
    color: colors.textFaint,
  },
};

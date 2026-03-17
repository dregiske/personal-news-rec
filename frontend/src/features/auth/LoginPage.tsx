import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import { button, card, errorText } from '../../styles/common';
import { colors, font, spacing } from '../../styles/theme';

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
    <PageLayout title="Login">
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

          <button type="submit" style={button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p style={errorText}>{message}</p>}

        <p style={styles.switchLink}>
          Don't have an account? <Link to="/signup">Sign up</Link>
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
  switchLink: {
    marginTop: spacing.md,
    fontSize: font.sm,
    color: colors.textFaint,
  },
};

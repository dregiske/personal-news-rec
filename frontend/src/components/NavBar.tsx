import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { colors, font, spacing } from '../styles/theme';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>The News Rec</h2>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/login" style={styles.link} onClick={logout}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  nav: {
    height: '60px',
    padding: `0 ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: colors.navBg,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },
  logo: {
    color: colors.navText,
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: spacing.lg,
  },
  link: {
    color: colors.navText,
    textDecoration: 'none',
    fontSize: font.base,
  },
};

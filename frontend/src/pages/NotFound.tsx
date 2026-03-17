import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { colors, font } from '../styles/theme';

export default function NotFound() {
  return (
    <PageLayout title="404 — Page Not Found">
      <p style={{ color: colors.textLight, fontSize: font.md }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{ fontSize: font.base, color: colors.primary }}>
        Go home
      </Link>
    </PageLayout>
  );
}

import type { ReactNode, CSSProperties } from 'react';
import { pageTitle, pageSubtitle } from '../styles/common';
import { spacing } from '../styles/theme';

interface Props {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: Props) {
  return (
    <div style={styles.container}>
      {title && <h1 style={pageTitle}>{title}</h1>}
      {subtitle && <p style={pageSubtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    padding: `0 ${spacing.lg}`,
  },
};

import type { CSSProperties } from 'react';
import { colors, font, radius, spacing } from './theme';

export const pageTitle: CSSProperties = {
  fontSize: font.xl,
  fontWeight: 'bold',
  marginBottom: spacing.md,
};

export const pageSubtitle: CSSProperties = {
  fontSize: font.md,
  color: colors.textLight,
  maxWidth: '700px',
  margin: '0 auto',
  marginTop: spacing.sm,
};

export const card: CSSProperties = {
  textAlign: 'left',
  maxWidth: '800px',
  margin: `${spacing.lg} auto`,
  padding: spacing.md,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
};

export const button: CSSProperties = {
  marginRight: spacing.sm,
  padding: `8px 12px`,
  fontSize: font.base,
  cursor: 'pointer',
  borderRadius: radius.sm,
  border: 'none',
  backgroundColor: colors.primary,
  color: colors.navText,
};

export const errorText: CSSProperties = {
  color: colors.danger,
  fontSize: font.sm,
  marginTop: spacing.xs,
};

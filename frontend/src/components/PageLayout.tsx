import type { ReactNode } from 'react';
import { pageWrapper, pageTitle, pageSubtitle } from '../styles';

interface Props {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: Props) {
  return (
    <div className={pageWrapper}>
      {title && <h1 className={`${pageTitle} mb-2`}>{title}</h1>}
      {subtitle && <p className={`${pageSubtitle} mb-8`}>{subtitle}</p>}
      {children}
    </div>
  );
}

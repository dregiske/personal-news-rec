import type { ReactNode } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageLayout({ title, subtitle, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-25 pb-16">
      {title && (
        <h1 className="text-3xl font-bold text-[#f5f0eb] mb-2">{title}</h1>
      )}
      {subtitle && (
        <p className="text-sm text-[#c4b8ac] mb-8">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

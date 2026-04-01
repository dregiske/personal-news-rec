import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
}

export default function PromptCard({ title, subtitle, onClose, children }: Props) {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-3xl font-bold text-fray-text">{title}</h1>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-fray-text-faint hover:text-fray-text transition-colors duration-200 bg-transparent border-none cursor-pointer text-2xl leading-none mt-1"
          >
            ×
          </button>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-fray-text-faint mb-8">{subtitle}</p>
      )}
      <div className="bg-fray-glass border border-fray-border backdrop-blur-md p-8">
        {children}
      </div>
    </div>
  );
}

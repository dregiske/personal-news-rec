import type { ReactNode } from "react";
import { card, pageTitle, pageSubtitle } from "../styles";

interface Props {
  title: string;
  titleClassName?: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
}

export default function PromptCard({
  title,
  titleClassName,
  subtitle,
  onClose,
  children,
}: Props) {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-start justify-between mb-1">
        <h1 className={titleClassName ?? pageTitle}>{title}</h1>
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
      {subtitle && <p className={`${pageSubtitle} mb-8`}>{subtitle}</p>}
      <div className={`${card} mt-2`}>{children}</div>
    </div>
  );
}

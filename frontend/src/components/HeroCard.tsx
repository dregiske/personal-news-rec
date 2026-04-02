import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { btnPrimary, btnSecondary } from "../styles";

export interface HeroButton {
  label: string;
  to: string;
  variant: "primary" | "secondary";
}

interface Props {
  eyebrow?: string;
  title: ReactNode;
  tagline?: string;
  description?: string;
  buttons?: HeroButton[];
  compact?: boolean;
}

export default function HeroCard({
  eyebrow,
  title,
  tagline,
  description,
  buttons,
  compact = false,
}: Props) {
  return (
    <div
      className={`mx-4 mt-4 rounded-3xl bg-fray-text overflow-hidden relative flex items-center justify-start ${
        compact ? "py-16" : "min-h-[calc(100vh-88px)]"
      }`}
    >
      <div className="relative z-10 text-left max-w-xl px-8 py-16 pl-12 sm:pl-16 lg:pl-24">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-fray-primary mb-5">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[4.5rem] font-bold leading-[1.05] text-fray-ink mb-4">
          {title}
        </h1>
        {tagline && (
          <p className="text-xl font-medium text-fray-bg mb-3">{tagline}</p>
        )}
        {description && (
          <p className="text-base text-fray-muted leading-relaxed mb-10 max-w-md">
            {description}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div className="flex gap-3 justify-start flex-wrap">
            {buttons.map((btn) => (
              <Link
                key={btn.to}
                to={btn.to}
                className={
                  btn.variant === "primary" ? btnPrimary : btnSecondary
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

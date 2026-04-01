interface Props {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function TopicButton({
  active,
  onClick,
  children,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 ${
        active
          ? "bg-fray-primary text-fray-ink shadow-fray-sm"
          : "bg-fray-surface-alt text-fray-text-faint hover:bg-fray-primary/10 hover:text-fray-primary"
      } ${className}`}
    >
      {children}
    </button>
  );
}

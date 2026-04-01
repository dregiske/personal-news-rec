interface Props {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function TopicButton({ active, onClick, children, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 border transition-colors duration-200 ${
        active
          ? 'border-fray-primary text-fray-primary'
          : 'border-fray-border text-fray-text-faint hover:border-fray-primary hover:text-fray-primary'
      } ${className}`}
    >
      {children}
    </button>
  );
}

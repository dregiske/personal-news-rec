interface Props {
  saved: boolean;
  onSave: () => void;
  small?: boolean;
}

export default function SaveButton({ saved, onSave, small = false }: Props) {
  const base = small
    ? 'text-xs px-2 py-1 border font-medium transition-colors duration-200'
    : 'text-sm px-3 py-1.5 border font-medium transition-colors duration-200';

  return (
    <button
      onClick={onSave}
      className={`${base} ${
        saved
          ? 'border-fray-primary text-fray-primary'
          : 'border-fray-border text-fray-text-light hover:border-fray-primary hover:text-fray-primary'
      }`}
    >
      {saved ? 'Saved ✓' : 'Save'}
    </button>
  );
}

interface Props {
  saved: boolean;
  onSave: () => void;
  small?: boolean;
}

export default function SaveButton({ saved, onSave, small = false }: Props) {
  const base = small
    ? 'text-xs px-2 py-1 font-medium rounded-lg transition-all duration-200'
    : 'text-sm px-3 py-1.5 font-medium rounded-lg transition-all duration-200';

  return (
    <button
      onClick={onSave}
      className={`${base} ${
        saved
          ? 'bg-fray-primary/15 text-fray-primary'
          : 'bg-fray-surface-alt text-fray-text-faint hover:bg-fray-primary/15 hover:text-fray-primary'
      }`}
    >
      {saved ? 'Saved ✓' : 'Save'}
    </button>
  );
}

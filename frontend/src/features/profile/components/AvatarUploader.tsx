import { useRef } from 'react';
import UserAvatar from './UserAvatar';

interface Props {
  currentUrl?: string | null;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  loading?: boolean;
  error?: string;
  size?: number;
}

export default function AvatarUploader({
  currentUrl,
  onFileSelect,
  onRemove,
  loading = false,
  error,
  size = 80,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Change avatar"
      >
        <UserAvatar avatarUrl={currentUrl} size={size} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="text-xs font-semibold uppercase tracking-widest px-4 py-1.5 border border-fray-border text-fray-text-light hover:border-fray-primary hover:text-fray-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Change Avatar'}
        </button>

        {onRemove && currentUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className="text-xs font-semibold uppercase tracking-widest px-4 py-1.5 border border-fray-border text-fray-text-faint hover:border-fray-danger hover:text-fray-danger transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Avatar
          </button>
        )}

        <p className="text-xs text-fray-text-faint">JPEG, PNG, WebP or GIF · Max 5 MB</p>

        {error && <p className="text-xs text-fray-danger text-center">{error}</p>}
      </div>
    </div>
  );
}

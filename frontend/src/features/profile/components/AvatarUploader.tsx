import { useRef } from 'react';
import UserAvatar from './UserAvatar';
import { btnGhost, btnDanger, metaText, formError } from '../../../styles';

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
          className={btnGhost}
        >
          {loading ? 'Saving...' : 'Change Avatar'}
        </button>

        {onRemove && currentUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className={btnDanger}
          >
            Remove Avatar
          </button>
        )}

        <p className={metaText}>JPEG, PNG, WebP or GIF · Max 5 MB</p>

        {error && <p className={`${formError} text-center`}>{error}</p>}
      </div>
    </div>
  );
}

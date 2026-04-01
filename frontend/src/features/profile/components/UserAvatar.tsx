interface Props {
  avatarUrl?: string | null;
  size?: number;
}

export default function UserAvatar({ avatarUrl, size = 32 }: Props) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Avatar"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-fray-surface-alt flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-fray-text-faint"
        style={{ width: size * 0.55, height: size * 0.55 }}
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import UserAvatar from './UserAvatar';
import { USER_MENU_LINKS } from '../../../constants';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center cursor-pointer bg-transparent border-none p-0"
        aria-label="Open user menu"
      >
        <UserAvatar avatarUrl={user.avatar_url} size={34} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 border border-fray-border bg-fray-nav-bg backdrop-blur-md z-50">
          <div className="px-4 py-3 border-b border-fray-border">
            <p className="text-sm font-semibold text-fray-text truncate">
              {user.username ?? 'User'}
            </p>
            <p className="text-xs text-fray-text-faint truncate">{user.email}</p>
          </div>

          <nav className="py-1">
            {USER_MENU_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-fray-text-light hover:text-fray-text hover:bg-fray-glass transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-fray-border py-1">
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full text-left px-4 py-2 text-sm text-fray-text-faint hover:text-fray-danger transition-colors duration-150 cursor-pointer bg-transparent border-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

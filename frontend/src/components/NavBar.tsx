import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-15 px-8 flex items-center justify-between border-b border-fray-border backdrop-blur-md bg-fray-nav-bg">
      <Link to="/" className="font-bold text-xl tracking-tight text-fray-text hover:text-fray-primary transition-colors duration-200">
        The Fray
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <button
              onClick={logout}
              className="text-sm text-fray-text-light hover:text-fray-primary transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              Logout
            </button>
            <Link to="/saved" className="text-sm text-fray-text-light hover:text-fray-text transition-colors duration-200">
              Saved
            </Link>
            <Link to="/dashboard" className="text-sm font-semibold px-4 py-1.5 border border-fray-primary text-fray-primary hover:bg-fray-primary hover:text-fray-ink transition-colors duration-200">
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-fray-text-light hover:text-fray-text transition-colors duration-200">
              Login
            </Link>
            <Link to="/signup" className="text-sm text-fray-text-light hover:text-fray-text transition-colors duration-200">
              Sign Up
            </Link>
            <Link to="/" className="text-sm font-semibold px-4 py-1.5 border border-fray-primary text-fray-primary hover:bg-fray-primary hover:text-fray-ink transition-colors duration-200">
              Home
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

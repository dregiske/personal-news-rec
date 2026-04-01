import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import UserMenu from "../features/profile/components/UserMenu";
import { navLink, btnPrimary } from "../styles";

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-15 px-8 flex items-center justify-between bg-fray-surface shadow-fray-nav">
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight text-fray-text hover:text-fray-primary transition-colors duration-200"
      >
        The <span className="text-fray-primary">Fray</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/login" className={navLink}>Login</Link>
            <Link to="/signup" className={navLink}>Sign Up</Link>
            <Link to="/" className={`${btnPrimary} text-xs px-4 py-1.5`}>
              Home
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

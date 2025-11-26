import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { useAuth } from "./features/auth/AuthContext";

function HomePage() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Home</h1>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default function App() {
  return (
      <Routes>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #000000ff" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>

      <Route path="/" element={ <LoginPage /> } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

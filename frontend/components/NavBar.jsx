import { Link } from "react-router-dom";
import { useAuth } from "../src/features/auth/AuthContext";

export default function NavBar() {

  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>The News Rec</h2>

      <div style={styles.links}>
		{user ? (
			<>
			  <Link to="/dashboard" style={styles.link}>Dashboard</Link>
			  <button onClick={logout} style={styles.button}>
				Logout
			  </button>
			</>
		) : (
			<>
        	  <Link to="/login" style={styles.link}>Login</Link>
        	  <Link to="/signup" style={styles.link}>Signup</Link>
			</>
		)}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: "60px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#111",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  logo: {
    color: "white",
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
  },
  button: {
	background: "transparent",
	border: "none",
	color: "white",
	padding: "5px 10px",
	cursor: "pointer",
  },
};

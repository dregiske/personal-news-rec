import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>NewsRec</h2>

      <div style={styles.links}>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Signup</Link>
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
};

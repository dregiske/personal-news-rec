import { useAuth } from "../src/features/auth/AuthContext";

export default function Dashboard() {

  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
		{user ? `Welcome back, ${user.email}` : "Welcome to your dashboard"}
	  </h1>

      <p style={styles.subtitle}>
        This platform delivers tailored news recommendations based on your
        reading history, preferences, and trending global topics.  
        Here's what we found for you today.
      </p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "100px",
    textAlign: "center",
    padding: "0 20px",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
    maxWidth: "700px",
    margin: "0 auto",
    marginTop: "10px",
  },
};

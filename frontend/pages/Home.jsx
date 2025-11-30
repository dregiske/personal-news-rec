export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Your Personalized News Engine</h1>

      <p style={styles.description}>
        This platform delivers tailored news recommendations based on your
        reading history, preferences, and trending global topics.  
        Sign up or log in to start receiving personalized content.
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
  description: {
    fontSize: "1.2rem",
    color: "#555",
    maxWidth: "700px",
    margin: "0 auto",
    marginTop: "10px",
  },
};

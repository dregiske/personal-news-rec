import { useAuth } from "../src/features/auth/AuthContext";

import { useEffect, useState } from "react";

import api from "../src/api/api";

export default function Dashboard() {

  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	async function loadFeed() {
	  try {
		const res = await api.get("/feed");
		setArticles(res.data);
	  } catch (err) {
		console.error("Error loading feed:", err);
	  } finally{
		setLoading(false);
	  }
	}
	loadFeed();
  }, []);

  if (loading) {
	return <p style={{ paddingTop: "60px", textAlign: "center" }}>Loading your feed ...</p>
  }

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

	  <div>
		{articles.map((a) => (
		  <article
			key={a.id}
			style={styles.article}
		  >
			<h2 style={styles.article_title}>{a.title}</h2>
			{a.source && <p style={styles.article_source}>{a.source}</p>}
			{a.content && <p style={styles.article_content}>{a.content}</p>}
			<a href={a.url} target="_blank" rel="noopener noreferrer">Read more</a>
		  </article>
		))}
	  </div>
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
  article: {
	marginBottom: "30px",
	textAlign: "left",
	maxWidth: "800px",
	margin: "20px auto",
	padding: "15px",
	border: "1px solid #ddd",
	borderRadius: "8px",
  },
  article_title: {
	fontSize: "1.5rem",
	fontWeight: "bold",
	marginBottom: "10px",
  },
  article_source: {
	fontSize: "0.9rem",
	color: "#888",
  },
  article_content: {
	fontSize: "1rem",
	color: "#333",
	marginBottom: "10px",
  },
};

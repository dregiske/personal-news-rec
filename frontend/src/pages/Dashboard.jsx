import { useAuth } from "../features/auth/AuthContext";

import { useEffect, useState, useCallback } from "react";

// import { fetchForYou } from "../api/for-you";
import { fetchFeed } from "../api/feed";

import { recordInteraction } from "../api/interactions";

export default function Dashboard() {

  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
	let isMounted = true;
	async function loadFeed() {
	  try {
		setLoading(true);
		//const forYouData = await fetchForYou();
		const feedData = await fetchFeed();
		if (isMounted) setArticles(feedData);
	  } catch (err) {
		console.error("Error loading feed:", err);
		if (isMounted) setError("Failed to load feed. Please try again later.");
	  } finally {
		if (isMounted) setLoading(false);
	  }
	}
	loadFeed();
	return () => {
	  isMounted = false;
	};
  }, []);

  const sendInteraction = useCallback(async (articleId, type) => {
	await recordInteraction(articleId, type);
  }, []);

  if (loading) {
	return <p style={{ paddingTop: "60px", textAlign: "center" }}>Loading your feed ...</p>
  }
  if (error) {
	return <p style={{ paddingTop: "60px", textAlign: "center", color: "red" }}>{error}</p>
  }

  return (
	<div style={styles.container}>
	  <h1 style={styles.title}>
		{user ? `Welcome, ${user.email}` : "Welcome to your dashboard"}
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
			<div className="interaction_buttons" style={styles.article_buttons}>
			  <button style={styles.article_button} onClick={() => sendInteraction(a.id, "like")}>Like</button>
			  <button style={styles.article_button} onClick={() => sendInteraction(a.id, "dislike")}>Dislike</button>
			</div>
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
  article_buttons: {
	textAlign: "right",
	display: "flex",
	justifyContent: "flex-end",
  },
  article_button: {
	marginRight: "10px",
	padding: "8px 12px",
	fontSize: "0.9rem",
	cursor: "pointer",
	borderRadius: "4px",
	border: "none",
	backgroundColor: "#007BFF",
	color: "white",
  },
};

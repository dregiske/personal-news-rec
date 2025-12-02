export async function recordInteraction(articleId, type) {
  const token = localStorage.getItem("access_token");
  if (!token) {
	throw new Error("No access token found");
  }
  try {
	await fetch("http://localhost:8000/interactions/", {
	  method: "POST",
	  credentials: "include",
	  headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${token}`,
	  },
	  body: JSON.stringify({
		article_id: articleId,
		type,
	  }),
	});
  } catch (err) {
	console.error("Failed to record interaction:", err);
  }
}

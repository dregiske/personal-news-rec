export async function recordInteraction(articleId, type) {
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

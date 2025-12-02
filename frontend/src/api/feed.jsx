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
import api from "./api";

export async function recordInteraction(articleId, type) {
  const response = await api.post("/interactions/", {
	article_id: articleId,
	type,
  });
  return response.data;
}

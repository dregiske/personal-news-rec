import api, { API_BASE } from "./api";
import type { InteractionType } from "../types";

export async function recordInteraction(
  articleId: number,
  type: InteractionType,
): Promise<void> {
  await api.post(`${API_BASE}/interactions/`, {
    article_id: articleId,
    type,
  });
}

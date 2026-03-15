import api from './api';
import type { InteractionType } from '../types';

export async function recordInteraction(articleId: string, type: InteractionType): Promise<void> {
  await api.post('/api/v1/interactions/', {
    article_id: articleId,
    type,
  });
}

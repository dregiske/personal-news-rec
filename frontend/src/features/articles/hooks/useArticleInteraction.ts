import { useState } from 'react';
import { recordInteraction, deleteInteraction } from '../api';
import { saveArticle, unsaveArticle } from '../../saved/api';

export type InteractionState = 'idle' | 'liked' | 'disliked';

export function useArticleInteraction(articleId: number, isSaved: boolean) {
  const [interaction, setInteraction] = useState<InteractionState>('idle');
  const [saved, setSaved] = useState(isSaved);
  const [error, setError] = useState('');

  async function handleInteraction(type: 'like' | 'dislike') {
    const newState = type === 'like' ? 'liked' : 'disliked';
    try {
      if (interaction === newState) {
        await deleteInteraction(articleId);
        setInteraction('idle');
      } else {
        await recordInteraction(articleId, type);
        setInteraction(newState);
      }
      setError('');
    } catch {
      setError('Could not save your reaction. Try again.');
    }
  }

  async function handleSave() {
    try {
      if (saved) {
        await unsaveArticle(articleId);
        setSaved(false);
      } else {
        await saveArticle(articleId);
        setSaved(true);
      }
    } catch {
      setError('Could not update saved status. Try again.');
    }
  }

  function handleReadMore() {
    recordInteraction(articleId, 'view').catch(() => {});
  }

  return { interaction, saved, error, handleInteraction, handleSave, handleReadMore };
}

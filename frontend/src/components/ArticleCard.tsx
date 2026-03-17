import { useState } from 'react';
import type { CSSProperties } from 'react';
import { recordInteraction } from '../api/interactions';
import { card, button, errorText } from '../styles/common';
import { colors, font, spacing } from '../styles/theme';
import type { Article } from '../types';

interface Props {
  article: Article;
}

type InteractionState = 'idle' | 'liked' | 'disliked';

export default function ArticleCard({ article }: Props) {
  const [interaction, setInteraction] = useState<InteractionState>('idle');
  const [error, setError] = useState('');

  async function handleInteraction(type: 'like' | 'dislike') {
    try {
      await recordInteraction(article.id, type);
      setInteraction(type === 'like' ? 'liked' : 'disliked');
      setError('');
    } catch {
      setError('Could not save your reaction. Try again.');
    }
  }

  function handleReadMore() {
    recordInteraction(article.id, 'view').catch(() => {});
  }

  return (
    <article style={card}>
      <h2 style={styles.title}>{article.title}</h2>
      {article.source && <p style={styles.source}>{article.source}</p>}
      {article.content && <p style={styles.content}>{article.content}</p>}

      <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={handleReadMore}>
        Read more
      </a>

      {error && <p style={errorText}>{error}</p>}

      <div style={styles.buttons}>
        <button
          style={{ ...button, backgroundColor: interaction === 'liked' ? colors.success : colors.primary }}
          onClick={() => handleInteraction('like')}
          disabled={interaction !== 'idle'}
        >
          {interaction === 'liked' ? 'Liked ✓' : 'Like'}
        </button>
        <button
          style={{ ...button, backgroundColor: interaction === 'disliked' ? colors.muted : colors.primary }}
          onClick={() => handleInteraction('dislike')}
          disabled={interaction !== 'idle'}
        >
          {interaction === 'disliked' ? 'Disliked ✓' : 'Dislike'}
        </button>
      </div>
    </article>
  );
}

const styles: Record<string, CSSProperties> = {
  title: {
    fontSize: font.lg,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  source: {
    fontSize: font.sm,
    color: colors.textFaint,
  },
  content: {
    fontSize: font.base,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
};

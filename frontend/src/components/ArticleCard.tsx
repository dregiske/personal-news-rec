import { useState } from 'react';
import { recordInteraction } from '../api/interactions';
import { saveArticle, unsaveArticle } from '../api/saved';
import type { Article } from '../types';

interface Props {
  article: Article;
  variant?: 'featured' | 'compact' | 'list';
  isSaved?: boolean;
}

type InteractionState = 'idle' | 'liked' | 'disliked';

export default function ArticleCard({ article, variant = 'list', isSaved = false }: Props) {
  const [interaction, setInteraction] = useState<InteractionState>('idle');
  const [saved, setSaved] = useState(isSaved);
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

  async function handleSave() {
    try {
      if (saved) {
        await unsaveArticle(article.id);
        setSaved(false);
      } else {
        await saveArticle(article.id);
        setSaved(true);
      }
    } catch {
      setError('Could not update saved status. Try again.');
    }
  }

  function handleReadMore() {
    recordInteraction(article.id, 'view').catch(() => {});
  }

  if (variant === 'featured') {
    return (
      <article className="h-full flex flex-col justify-between p-6 bg-fray-glass border border-fray-border backdrop-blur-md">
        <div>
          {article.source && (
            <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-3">
              {article.source}
            </p>
          )}
          <h2 className="text-3xl font-bold text-fray-text leading-tight mb-4">
            {article.title}
          </h2>
          {article.content && (
            <p className="text-sm text-fray-text-light leading-relaxed line-clamp-4">
              {article.content}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-fray-border">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleReadMore}
            className="text-sm font-semibold text-fray-primary hover:text-fray-text transition-colors duration-200"
          >
            Read more →
          </a>
          <div className="flex items-center gap-3">
            <SaveButton saved={saved} onSave={handleSave} />
            <InteractionButtons interaction={interaction} onInteract={handleInteraction} />
          </div>
        </div>
        {error && <p className="text-xs text-fray-danger mt-2">{error}</p>}
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group relative overflow-hidden p-4 bg-fray-glass border border-fray-border backdrop-blur-md cursor-pointer h-full">
        {/* Default view */}
        <div className="transition-opacity duration-300 group-hover:opacity-0">
          {article.source && (
            <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-1">
              {article.source}
            </p>
          )}
          <h3 className="text-sm font-semibold text-fray-text leading-snug line-clamp-2">
            {article.title}
          </h3>
        </div>

        {/* Hover reveal */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-fray-overlay overflow-hidden">
          <p className="text-xs text-fray-text-light leading-relaxed line-clamp-5 overflow-hidden">
            {article.content ?? article.title}
          </p>
          <div className="flex items-center justify-between mt-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleReadMore}
              className="text-xs font-semibold text-fray-primary hover:text-fray-text transition-colors duration-200"
            >
              Read more →
            </a>
            <div className="flex items-center gap-2">
              <SaveButton saved={saved} onSave={handleSave} small />
              <InteractionButtons interaction={interaction} onInteract={handleInteraction} small />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // list variant (default)
  return (
    <article className="flex flex-col gap-2 p-5 bg-fray-glass border border-fray-border backdrop-blur-md hover:border-fray-border-hover transition-colors duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {article.source && (
            <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-1">
              {article.source}
            </p>
          )}
          <h3 className="text-base font-semibold text-fray-text leading-snug">
            {article.title}
          </h3>
          {article.content && (
            <p className="text-sm text-fray-text-light mt-1 line-clamp-2 leading-relaxed">
              {article.content}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {article.published_at && (
            <p className="text-xs text-fray-text-faint whitespace-nowrap">
              {new Date(article.published_at).toLocaleDateString()}
            </p>
          )}
          {article.view_count != null && article.view_count > 0 && (
            <p className="text-xs text-fray-text-faint whitespace-nowrap">
              {article.view_count.toLocaleString()} views
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-fray-border-subtle">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleReadMore}
          className="text-xs font-semibold text-fray-primary hover:text-fray-text transition-colors duration-200"
        >
          Read more →
        </a>
        <div className="flex items-center gap-2">
          <SaveButton saved={saved} onSave={handleSave} small />
          <InteractionButtons interaction={interaction} onInteract={handleInteraction} small />
        </div>
      </div>
      {error && <p className="text-xs text-fray-danger">{error}</p>}
    </article>
  );
}

interface SaveButtonProps {
  saved: boolean;
  onSave: () => void;
  small?: boolean;
}

function SaveButton({ saved, onSave, small = false }: SaveButtonProps) {
  const base = small
    ? 'text-xs px-2 py-1 border font-medium transition-colors duration-200'
    : 'text-sm px-3 py-1.5 border font-medium transition-colors duration-200';

  return (
    <button
      className={`${base} ${
        saved
          ? 'border-fray-primary text-fray-primary'
          : 'border-fray-border text-fray-text-light hover:border-fray-primary hover:text-fray-primary'
      }`}
      onClick={onSave}
    >
      {saved ? 'Saved ✓' : 'Save'}
    </button>
  );
}

interface InteractionButtonsProps {
  interaction: InteractionState;
  onInteract: (type: 'like' | 'dislike') => void;
  small?: boolean;
}

function InteractionButtons({ interaction, onInteract, small = false }: InteractionButtonsProps) {
  const base = small
    ? 'text-xs px-2 py-1 border font-medium transition-colors duration-200 disabled:opacity-50'
    : 'text-sm px-3 py-1.5 border font-medium transition-colors duration-200 disabled:opacity-50';

  return (
    <div className="flex gap-2">
      <button
        className={`${base} ${
          interaction === 'liked'
            ? 'border-fray-success text-fray-success'
            : 'border-fray-border text-fray-text-light hover:border-fray-success hover:text-fray-success'
        }`}
        onClick={() => onInteract('like')}
        disabled={interaction !== 'idle'}
      >
        {interaction === 'liked' ? 'Liked ✓' : 'Like'}
      </button>
      <button
        className={`${base} ${
          interaction === 'disliked'
            ? 'border-fray-muted text-fray-muted'
            : 'border-fray-border text-fray-text-light hover:border-fray-muted hover:text-fray-muted'
        }`}
        onClick={() => onInteract('dislike')}
        disabled={interaction !== 'idle'}
      >
        {interaction === 'disliked' ? 'Disliked ✓' : 'Dislike'}
      </button>
    </div>
  );
}

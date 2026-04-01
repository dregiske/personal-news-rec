import type { InteractionState } from '../hooks/useArticleInteraction';

interface Props {
  interaction: InteractionState;
  onInteract: (type: 'like' | 'dislike') => void;
  small?: boolean;
}

export default function InteractionButtons({ interaction, onInteract, small = false }: Props) {
  const base = small
    ? 'text-xs px-2 py-1 border font-medium transition-colors duration-200'
    : 'text-sm px-3 py-1.5 border font-medium transition-colors duration-200';

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onInteract('like')}
        className={`${base} ${
          interaction === 'liked'
            ? 'border-fray-success text-fray-success'
            : 'border-fray-border text-fray-text-light hover:border-fray-success hover:text-fray-success'
        }`}
      >
        {interaction === 'liked' ? 'Liked ✓' : 'Like'}
      </button>
      <button
        onClick={() => onInteract('dislike')}
        className={`${base} ${
          interaction === 'disliked'
            ? 'border-fray-muted text-fray-muted'
            : 'border-fray-border text-fray-text-light hover:border-fray-muted hover:text-fray-muted'
        }`}
      >
        {interaction === 'disliked' ? 'Disliked ✓' : 'Dislike'}
      </button>
    </div>
  );
}

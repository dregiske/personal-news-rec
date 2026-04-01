import type { InteractionState } from '../hooks/useArticleInteraction';

interface Props {
  interaction: InteractionState;
  onInteract: (type: 'like' | 'dislike') => void;
  small?: boolean;
}

export default function InteractionButtons({ interaction, onInteract, small = false }: Props) {
  const base = small
    ? 'text-xs px-2 py-1 font-medium rounded-lg transition-all duration-200'
    : 'text-sm px-3 py-1.5 font-medium rounded-lg transition-all duration-200';

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onInteract('like')}
        className={`${base} ${
          interaction === 'liked'
            ? 'bg-fray-success/15 text-fray-success'
            : 'bg-fray-surface-alt text-fray-text-faint hover:bg-fray-success/15 hover:text-fray-success'
        }`}
      >
        {interaction === 'liked' ? 'Liked ✓' : 'Like'}
      </button>
      <button
        onClick={() => onInteract('dislike')}
        className={`${base} ${
          interaction === 'disliked'
            ? 'bg-fray-danger/15 text-fray-danger'
            : 'bg-fray-surface-alt text-fray-text-faint hover:bg-fray-danger/15 hover:text-fray-danger'
        }`}
      >
        {interaction === 'disliked' ? 'Disliked ✓' : 'Dislike'}
      </button>
    </div>
  );
}

import type { Article } from '../../../types';
import { useArticleInteraction } from '../hooks/useArticleInteraction';
import SaveButton from './SaveButton';
import InteractionButtons from './InteractionButtons';

interface Props {
  article: Article;
  isSaved?: boolean;
}

export default function CompactArticleCard({ article, isSaved = false }: Props) {
  const { interaction, saved, handleInteraction, handleSave, handleReadMore } =
    useArticleInteraction(article.id, isSaved);
  const preview = article.description ?? article.content ?? null;

  return (
    <article className="group relative overflow-hidden border border-fray-border cursor-pointer h-full">
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="absolute inset-0 bg-fray-bg/80 backdrop-blur-sm" />

      <div className="relative h-full p-4 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
        {article.source && (
          <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-1">
            {article.source}
          </p>
        )}
        <h3 className="text-sm font-semibold text-fray-text leading-snug line-clamp-3">
          {article.title}
        </h3>
      </div>

      <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-fray-overlay">
        <div className="overflow-hidden">
          {article.author && (
            <p className="text-xs text-fray-text-faint mb-1">By {article.author}</p>
          )}
          <p className="text-xs text-fray-text-light leading-relaxed line-clamp-4">
            {preview ?? article.title}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2 shrink-0">
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

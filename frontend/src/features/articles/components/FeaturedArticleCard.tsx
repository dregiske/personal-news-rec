import type { Article } from '../../../types';
import { useArticleInteraction } from '../hooks/useArticleInteraction';
import SaveButton from './SaveButton';
import InteractionButtons from './InteractionButtons';

interface Props {
  article: Article;
  isSaved?: boolean;
}

export default function FeaturedArticleCard({ article, isSaved = false }: Props) {
  const { interaction, saved, error, handleInteraction, handleSave, handleReadMore } =
    useArticleInteraction(article.id, isSaved);
  const preview = article.description ?? article.content ?? null;

  return (
    <article className="h-full flex flex-col bg-fray-glass border border-fray-border backdrop-blur-md">
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-52 object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="flex flex-col flex-1 justify-between p-6">
        <div>
          {article.source && (
            <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-1">
              {article.source}
            </p>
          )}
          {article.author && (
            <p className="text-xs text-fray-text-faint mb-3">By {article.author}</p>
          )}
          <h2 className="text-3xl font-bold text-fray-text leading-tight mb-4">{article.title}</h2>
          {preview && (
            <p className="text-sm text-fray-text-light leading-relaxed line-clamp-4">{preview}</p>
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
      </div>
    </article>
  );
}

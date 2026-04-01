import type { Article } from '../../../types';
import { useArticleInteraction } from '../hooks/useArticleInteraction';
import SaveButton from './SaveButton';
import InteractionButtons from './InteractionButtons';

interface Props {
  article: Article;
  isSaved?: boolean;
}

export default function ListArticleCard({ article, isSaved = false }: Props) {
  const { interaction, saved, error, handleInteraction, handleSave, handleReadMore } =
    useArticleInteraction(article.id, isSaved);
  const preview = article.description ?? article.content ?? null;

  return (
    <article className="flex flex-col gap-2 p-5 bg-fray-glass border border-fray-border backdrop-blur-md hover:border-fray-border-hover transition-colors duration-200">
      <div className="flex items-start gap-4">
        {article.image_url && (
          <img
            src={article.image_url}
            alt=""
            className="w-20 h-20 object-cover shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {article.source && (
                <p className="text-xs font-semibold uppercase tracking-widest text-fray-primary mb-1">
                  {article.source}
                </p>
              )}
              <h3 className="text-base font-semibold text-fray-text leading-snug">{article.title}</h3>
              {article.author && (
                <p className="text-xs text-fray-text-faint mt-0.5">By {article.author}</p>
              )}
              {preview && (
                <p className="text-sm text-fray-text-light mt-1 line-clamp-2 leading-relaxed">
                  {preview}
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

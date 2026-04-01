import type { Article } from '../../../types';
import { useArticleInteraction } from '../hooks/useArticleInteraction';
import SaveButton from './SaveButton';
import InteractionButtons from './InteractionButtons';
import { cardInteractive, sourceTag, bodyText, metaText, linkPrimary, divider } from '../../../styles';

interface Props {
  article: Article;
  isSaved?: boolean;
}

export default function ListArticleCard({ article, isSaved = false }: Props) {
  const { interaction, saved, error, handleInteraction, handleSave, handleReadMore } =
    useArticleInteraction(article.id, isSaved);
  const preview = article.description ?? article.content ?? null;

  return (
    <div className="fray-lift rounded-2xl">
    <article className={`${cardInteractive} flex flex-col gap-2 p-5`}>
      <div className="flex items-start gap-4">
        {article.image_url && (
          <img
            src={article.image_url}
            alt=""
            className="w-20 h-20 object-cover shrink-0 rounded-lg"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {article.source && (
                <p className={`${sourceTag} mb-1`}>{article.source}</p>
              )}
              <h3 className="text-base font-semibold text-fray-text leading-snug">{article.title}</h3>
              {article.author && (
                <p className={`${metaText} mt-0.5`}>By {article.author}</p>
              )}
              {preview && (
                <p className={`${bodyText} mt-1 line-clamp-2`}>{preview}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {article.published_at && (
                <p className={`${metaText} whitespace-nowrap`}>
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              )}
              {article.view_count != null && article.view_count > 0 && (
                <p className={`${metaText} whitespace-nowrap`}>
                  {article.view_count.toLocaleString()} views
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`flex items-center justify-between pt-2 ${divider}`}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleReadMore}
          className={`${linkPrimary} text-xs`}
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
    </div>
  );
}

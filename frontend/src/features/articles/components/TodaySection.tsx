import ArticleCard from './ArticleCard';
import type { Article } from '../../../types';

interface Props {
  articles: Article[];
  savedIds: Set<number>;
}

export default function TodaySection({ articles, savedIds }: Props) {
  if (!articles.length) return null;

  return (
    <section className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold uppercase tracking-widest text-fray-text">
          Today on the News
        </h2>
        <div className="flex-1 h-px bg-fray-surface-alt" />
      </div>

      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="list"
            isSaved={savedIds.has(article.id)}
          />
        ))}
      </div>
    </section>
  );
}

import ArticleCard from "./ArticleCard";
import type { Article } from "../../../types";
import { sectionLabel } from "../../../styles";

interface Props {
  articles: Article[];
  savedIds: Set<number>;
}

export default function HeroSection({ articles, savedIds }: Props) {
  const [featured, ...topPicks] = articles;

  if (!featured) return null;

  return (
    <section className="w-full mb-10">
      <p className={`${sectionLabel} mb-4`}>Your Top Picks</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <ArticleCard
            article={featured}
            variant="featured"
            isSaved={savedIds.has(featured.id)}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {topPicks.slice(0, 3).map((article) => (
            <div key={article.id} className="flex-1 min-h-40">
              <ArticleCard
                article={article}
                variant="compact"
                isSaved={savedIds.has(article.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

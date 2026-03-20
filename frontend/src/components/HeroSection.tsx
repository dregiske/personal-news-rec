import ArticleCard from './ArticleCard';
import type { Article } from '../types';

interface Props {
  articles: Article[];
}

export default function HeroSection({ articles }: Props) {
  const [featured, ...topPicks] = articles;

  if (!featured) return null;

  return (
    <section className="w-full mb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint mb-4">
        Your Top Picks
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-fray-border">
        {/* Featured article — left, larger */}
        <div className="lg:col-span-3 bg-fray-bg">
          <ArticleCard article={featured} variant="featured" />
        </div>

        {/* Top picks — right, stacked */}
        <div className="lg:col-span-2 flex flex-col gap-px bg-fray-border">
          {topPicks.slice(0, 3).map((article) => (
            <div key={article.id} className="flex-1 min-h-40 bg-fray-bg">
              <ArticleCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

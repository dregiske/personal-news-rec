import type { Article } from '../../../types';
import FeaturedArticleCard from './FeaturedArticleCard';
import CompactArticleCard from './CompactArticleCard';
import ListArticleCard from './ListArticleCard';

interface Props {
  article: Article;
  variant?: 'featured' | 'compact' | 'list';
  isSaved?: boolean;
}

export default function ArticleCard({ article, variant = 'list', isSaved = false }: Props) {
  if (variant === 'featured') return <FeaturedArticleCard article={article} isSaved={isSaved} />;
  if (variant === 'compact') return <CompactArticleCard article={article} isSaved={isSaved} />;
  return <ListArticleCard article={article} isSaved={isSaved} />;
}

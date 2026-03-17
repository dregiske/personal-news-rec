import { useAuth } from '../features/auth/AuthContext';
import { useFeed } from '../hooks/useFeed';
import ArticleCard from '../components/ArticleCard';
import PageLayout from '../components/PageLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const { articles, loading, error } = useFeed();

  if (loading) return <p style={{ paddingTop: '60px', textAlign: 'center' }}>Loading your feed...</p>;
  if (error)   return <p style={{ paddingTop: '60px', textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <PageLayout
      title={user ? `Welcome, ${user.email}` : 'Welcome to your dashboard'}
      subtitle="Here's what we found for you today."
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </PageLayout>
  );
}

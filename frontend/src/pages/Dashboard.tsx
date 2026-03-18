import { useAuth } from '../features/auth/AuthContext';
import { useFeed } from '../hooks/useFeed';
import PageLayout from '../components/PageLayout';
import HeroSection from '../components/HeroSection';
import TodaySection from '../components/TodaySection';

export default function Dashboard() {
  const { user } = useAuth();
  const { articles, loading, error } = useFeed();

  if (loading) return (
    <p className="pt-15 text-center text-fray-text-light mt-16">Loading your feed...</p>
  );
  if (error) return (
    <p className="pt-15 text-center text-fray-danger mt-16">{error}</p>
  );

  const heroArticles = articles.slice(0, 4);
  const todayArticles = articles.slice(4);

  return (
    <PageLayout
      title={user ? `Welcome, ${user.email}` : 'Welcome to your dashboard'}
      subtitle="Here's what we found for you today."
    >
      <HeroSection articles={heroArticles} />
      <TodaySection articles={todayArticles} />
    </PageLayout>
  );
}

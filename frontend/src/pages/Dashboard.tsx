import { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useFeed } from '../hooks/useFeed';
import PageLayout from '../components/PageLayout';
import HeroSection from '../components/HeroSection';
import TodaySection from '../components/TodaySection';
import TopicFilter from '../components/TopicFilter';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const { articles, savedIds, loading, error } = useFeed(activeTopic ?? undefined);

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
      title={user ? `Welcome, ${user.username ?? user.email}` : 'Welcome to your dashboard'}
      subtitle="Here's what we found for you today."
    >
      <TopicFilter active={activeTopic} onChange={setActiveTopic} />

      {articles.length === 0 ? (
        <p className="text-sm text-fray-text-faint mt-8">
          No articles available right now. Check back soon.
        </p>
      ) : (
        <>
          <HeroSection articles={heroArticles} savedIds={savedIds} />
          <TodaySection articles={todayArticles} savedIds={savedIds} />
        </>
      )}
    </PageLayout>
  );
}

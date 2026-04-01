import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useSavedIds } from '../saved/hooks/useSavedIds';
import { usePersonalizedFeed } from './hooks/usePersonalizedFeed';
import { useLatestFeed } from './hooks/useLatestFeed';
import PageLayout from '../../components/PageLayout';
import HeroSection from './components/HeroSection';
import TodaySection from './components/TodaySection';
import TopicFilter from './components/TopicFilter';
import FeedStatus from '../../components/FeedStatus';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const { savedIds } = useSavedIds();
  const { articles: heroArticles, loading: heroLoading, error: heroError } = usePersonalizedFeed(activeTopic);
  const { articles: latestArticles, loading: latestLoading, error: latestError } = useLatestFeed(activeTopic);

  const loading = heroLoading || latestLoading;
  const error = heroError || latestError;

  const isEmpty = heroArticles.length === 0 && latestArticles.length === 0;

  return (
    <PageLayout
      title={user ? `Welcome, ${user.username ?? user.email}` : 'Welcome to your dashboard'}
      subtitle="Here's what we found for you today."
    >
      <TopicFilter active={activeTopic} onChange={setActiveTopic} />

      <FeedStatus
        loading={loading}
        error={error}
        empty={isEmpty}
        emptyMessage="No articles available right now. Check back soon."
      />

      {!loading && !error && !isEmpty && (
        <>
          <HeroSection articles={heroArticles.slice(0, 4)} savedIds={savedIds} />
          <TodaySection articles={latestArticles} savedIds={savedIds} />
        </>
      )}
    </PageLayout>
  );
}

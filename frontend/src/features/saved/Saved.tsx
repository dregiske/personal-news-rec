import { fetchSaved } from './api';
import type { SavedArticle } from '../../types';
import ArticleCard from '../articles/components/ArticleCard';
import PageLayout from '../../components/PageLayout';
import FeedStatus from '../../components/FeedStatus';
import { useFetch } from '../../hooks/useFetch';

export default function SavedPage() {
  const { data, loading, error } = useFetch<SavedArticle[]>(fetchSaved, [], 'Failed to load saved articles.');
  const saved = data ?? [];

  return (
    <PageLayout title="Saved Articles" subtitle="Articles you've bookmarked for later.">
      <FeedStatus
        loading={loading}
        error={error}
        empty={saved.length === 0}
        emptyMessage="You haven't saved any articles yet. Hit Save on any article to find it here."
      />

      {!loading && !error && saved.length > 0 && (
        <div className="flex flex-col gap-px bg-fray-border">
          {saved.map((s) => (
            <div key={s.id} className="bg-fray-bg">
              <div className="px-5 pt-3">
                <p className="text-xs text-fray-text-faint">
                  Saved on {new Date(s.saved_at).toLocaleDateString()}
                </p>
              </div>
              <ArticleCard article={s.article} variant="list" isSaved />
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

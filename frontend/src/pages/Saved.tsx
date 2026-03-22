import { useEffect, useState } from 'react';
import { fetchSaved } from '../api/saved';
import type { SavedArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import PageLayout from '../components/PageLayout';

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSaved()
      .then(setSaved)
      .catch(() => setError('Failed to load saved articles.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <p className="pt-15 text-center text-fray-text-light mt-16">Loading saved articles...</p>
  );
  if (error) return (
    <p className="pt-15 text-center text-fray-danger mt-16">{error}</p>
  );

  return (
    <PageLayout title="Saved Articles" subtitle="Articles you've bookmarked for later.">
      {saved.length === 0 ? (
        <p className="text-sm text-fray-text-faint mt-8">
          You haven't saved any articles yet. Hit Save on any article to find it here.
        </p>
      ) : (
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

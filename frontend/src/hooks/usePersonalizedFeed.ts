import { useEffect, useState } from "react";
import { fetchFeed, fetchForYou } from "../api/feed";
import { fetchUserStats } from "../api/stats";
import type { Article } from "../types";

export function usePersonalizedFeed(activeTopic: string | null) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTopic) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    fetchUserStats()
      .then((stats) => (stats.is_personalized ? fetchForYou() : fetchFeed()))
      .then((data) => {
        if (isMounted) setArticles(data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load feed.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTopic]);

  return { articles, loading, error };
}

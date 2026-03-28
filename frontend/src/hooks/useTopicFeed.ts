import { useEffect, useState } from "react";
import { fetchFeedByTopic } from "../api/feed";
import type { Article } from "../types";

export function useTopicFeed(activeTopic: string | null) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeTopic) return;

    let isMounted = true;
    setLoading(true);
    setError("");

    fetchFeedByTopic(activeTopic)
      .then((data) => {
        if (isMounted) setArticles(data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load topic feed.");
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

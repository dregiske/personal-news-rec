import { useEffect, useState } from "react";
import { fetchSaved } from "../api/saved";

export function useSavedIds() {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    fetchSaved()
      .then((saved) => {
        if (isMounted) setSavedIds(new Set(saved.map((s) => s.article_id)));
      })
      .catch(() => {
        if (isMounted) setError("Failed to load saved articles.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { savedIds, loading, error };
}

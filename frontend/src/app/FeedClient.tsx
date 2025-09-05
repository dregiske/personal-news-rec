"use client";
import { useEffect, useRef, useState } from "react";
import { Article, fetchFeed } from "@/lib/api";

function ArticleCard({ a }: { a: Article }) {
  return (
    <a href={a.url} target="_blank" rel="noreferrer"
       className="block rounded-2xl border p-4 hover:bg-white/5 transition">
      <div className="text-sm opacity-70">{a.source}</div>
      <h3 className="text-lg font-semibold">{a.title}</h3>
      {a.summary && <p className="mt-2 text-sm opacity-80">{a.summary}</p>}
      <div className="mt-2 text-xs opacity-60">
        {new Date(a.published_at).toLocaleString()}
      </div>
    </a>
  );
}

export default function FeedClient() {
  const [items, setItems] = useState<Article[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (loading || done) return;
    setLoading(true);
    const data = await fetchFeed(cursor);
    setItems(prev => [...prev, ...data.items]);
    setCursor(data.next_cursor);
    setDone(!data.next_cursor);
    setLoading(false);
  }

  useEffect(() => { loadMore(); /* initial */ }, []);
  useEffect(() => {
    if (!sentinelRef.current || done) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) loadMore();
    }, { rootMargin: "200px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [sentinelRef, done]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Your news</h1>
      {items.map(a => <ArticleCard key={a.id} a={a} />)}
      {!done && <div ref={sentinelRef} className="h-12" />}
      {loading && <p className="opacity-60">Loading…</p>}
      {done && items.length === 0 && <p className="opacity-60">No articles yet.</p>}
    </main>
  );
}

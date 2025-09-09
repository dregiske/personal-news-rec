"use client";
import { useEffect, useRef, useState } from "react";
import { Article, fetchFeed } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api"

function SkeletonCard() {
  return (
    <div className="flex gap-4 border rounded-2xl p-4 animate-pulse">
      <div className="h-24 w-32 rounded-xl bg-white/10 dark:bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-24 bg-white/10 dark:bg-white/5 rounded" />
        <div className="h-5 w-3/4 bg-white/10 dark:bg-white/5 rounded" />
        <div className="h-4 w-2/3 bg-white/10 dark:bg-white/5 rounded" />
      </div>
    </div>
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="flex gap-4 border rounded-2xl p-4 hover:bg-white/5 transition">
      {/* Thumbnail (optional) */}
      {a.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.image_url}
          alt=""
          className="h-24 w-32 object-cover rounded-xl flex-shrink-0"
        />
      ) : (
        <div className="h-24 w-32 rounded-xl bg-white/5 flex-shrink-0" />
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-xs opacity-70">
          {a.source} · {new Date(a.published_at).toLocaleString()}
        </div>
        <a
          href={a.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-lg font-semibold line-clamp-2 hover:underline"
        >
          {a.title}
        </a>
        {a.summary && (
          <p className="mt-1 text-sm opacity-80 line-clamp-3">{a.summary}</p>
        )}

        {/* Actions (wired later) */}
        <div className="mt-2 flex gap-2 text-sm opacity-80">
          <button className="rounded-lg border px-3 py-1 hover:bg-white/5">
            👍 Like
          </button>
          <button className="rounded-lg border px-3 py-1 hover:bg-white/5">
            👎 Hide
          </button>
          <button className="rounded-lg border px-3 py-1 hover:bg-white/5">
            💾 Save
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FeedClient() {
	const router = useRouter();
  	const [items, setItems] = useState<Article[]>([]);
  	const [cursor, setCursor] = useState<string | undefined>(undefined);
  	const [loading, setLoading] = useState(false);
  	const [done, setDone] = useState(false);
  	const [error, setError] = useState<string | null>(null);
  	const sentinelRef = useRef<HTMLDivElement | null>(null);

  	async function loadMore() {
    	if (loading || done) return;
    	setLoading(true);
    	setError(null);
    	try {
      		const data = await fetchFeed(cursor);
      		setItems(prev => [...prev, ...data.items]);
      		setCursor(data.next_cursor);
      		setDone(!data.next_cursor);
    	} catch (e: any) {
			if(e instanceof ApiError && e.code === 401) {
				router.push("/login");
				return;
			}
      		console.error(e);
      		setError(e?.message ?? "Failed to load feed");
      		setDone(true); // stop infinite attempts
    	} finally {
      		setLoading(false);
    	}
  	}

	useEffect(() => { loadMore(); }, []);
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

      	{/* Errors */}
      	{error && (
    		<div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm">
        		{error}
        	</div>
      	)}

      	{/* Items */}
      	{items.map(a => <ArticleCard key={a.id} a={a} />)}

      	{/* Loading skeletons */}
      	{loading && !items.length && (
        <>
          	<SkeletonCard /><SkeletonCard /><SkeletonCard />
        </>
      	)}

      	{/* Infinite scroll sentinel */}
      	{!done && <div ref={sentinelRef} className="h-10" />}

      	{/* Empty state */}
      	{done && !items.length && !error && (
        	<p className="opacity-60">No articles yet.</p>
      	)}
    	</main>
  	);
}

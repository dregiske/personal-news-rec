
export class ApiError extends Error {
	code?: number;
	constructor(message: string, code?: number) {
		super(message);
		this.name = "ApiError";
		this.code = code;
	}
}

export type Article = {
  id: number; title: string; url: string; source: string;
  summary?: string; image_url?: string; published_at: string; topics?: string[];
};
export type FeedResponse = { items: Article[]; next_cursor?: string };

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchFeed(cursor?: string, limit = 20): Promise<FeedResponse> {
  const qs = new URLSearchParams();
  if (cursor) qs.set("cursor", cursor);
  qs.set("limit", String(limit));
  const res = await fetch(`${BASE}/feed?${qs.toString()}`, {
    credentials: "include", // send cookies
  });
  if(res.status === 401){
	const err  = new Error("Unauthorized") as any;
	err.code = 401;
	throw err;
  }
  if (!res.ok) throw new Error(`Feed error ${res.status}`);
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


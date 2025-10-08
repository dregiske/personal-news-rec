'''
Fetch Providers:
- fetch_rss(url): httpx + feedparser to parse RSS entries
into ArticleCreate objects
	- fallback to minimal XML parsing if feedparser isn't present

URL hygiene:
- canonicalize_url(): removes tracking params and fragments so the
same article URL isnt ingested twice

Upsert:
- upsert_article(db, items): checks Article.url uniqeness, accumulates
insets, and commits. Catches IntegrityError as last resort dedupe
'''

from __future__ import annotations
from typing import Iterable, List, Dict, Callable
from datetime import datetime, timezone
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

import httpx
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.schemas import ArticleCreate
from backend.models import Article
from backend.config import settings, rss_list

# Strip common tracking params to canonicalize URLs
_TRACKING_PARAMS = {
    "utm_source","utm_medium","utm_campaign","utm_term","utm_content",
    "utm_name","gclid","fbclid","mc_cid","mc_eid"
}

def canonicalize_url(url: str) -> str:
    p = urlsplit(url)
    # drop fragment and tracking params, keep order stable
    q = [(k, v) for k, v in parse_qsl(p.query, keep_blank_values=True) if k.lower() not in _TRACKING_PARAMS]
    p = p._replace(query=urlencode(q, doseq=True), fragment="")
    return urlunsplit(p)

def _safe_dt(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

# ---------- Providers ----------

def fetch_rss(url: str) -> List[ArticleCreate]:
    """
    Very light RSS fetcher using httpx + feedparser (recommended),
    falling back to best-effort if feedparser isn't installed.
    """
    resp = httpx.get(url, timeout=15)
    resp.raise_for_status()

    try:
        import feedparser
        feed = feedparser.parse(resp.text)
        out: List[ArticleCreate] = []
        feed_title = (feed.feed.get("title") if getattr(feed, "feed", None) else None) or url
        for e in feed.entries:
            link = e.get("link")
            title = e.get("title") or "(untitled)"
            if not link:
                continue
            # published
            pub_dt = None
            if getattr(e, "published_parsed", None):
                y,m,d,H,M,S = e.published_parsed[:6]
                pub_dt = datetime(y,m,d,H,M,S, tzinfo=timezone.utc)
            out.append(ArticleCreate(
                title=title,
                url=link,
                source=feed_title,
                published_at=pub_dt,
                content=None,
                keywords=None
            ))
        return out
    except ImportError:
        # Minimal fallback: naive extraction via <item><title>/<link>
        import xml.etree.ElementTree as ET
        out: List[ArticleCreate] = []
        root = ET.fromstring(resp.text)
        for item in root.findall(".//item"):
            title_el = item.find("title")
            link_el = item.find("link")
            title = (title_el.text or "(untitled)") if title_el is not None else "(untitled)"
            link = link_el.text if link_el is not None else None
            if not link:
                continue
            out.append(ArticleCreate(title=title, url=link, source=url))
        return out

def fetch_newsapi_top_headlines(country: str = "us", page_size: int = 50) -> List[ArticleCreate]:
    """
    Optional NewsAPI provider (requires NEWSAPI_KEY in .env).
    """
    if not settings.NEWSAPI_KEY:
        return []
    r = httpx.get(
        "https://newsapi.org/v2/top-headlines",
        params={"country": country, "pageSize": page_size, "apiKey": settings.NEWSAPI_KEY},
        timeout=20,
    )
    r.raise_for_status()
    data = r.json()
    out: List[ArticleCreate] = []
    for a in data.get("articles", []):
        if not a.get("url"):
            continue
        out.append(ArticleCreate(
            title=a.get("title") or "(untitled)",
            url=a["url"],
            source=(a.get("source") or {}).get("name"),
            content=a.get("description"),
            published_at=_safe_dt(a.get("publishedAt") and datetime.fromisoformat(a["publishedAt"].replace("Z", "+00:00"))),
            keywords=None,
        ))
    return out

# Registry of callables that return lists of ArticleCreate
Provider = Callable[[], List[ArticleCreate]]

def build_registry() -> List[Provider]:
    providers: List[Provider] = []
    for rss in rss_list():
        providers.append(lambda rss=rss: fetch_rss(rss))
    # Optional NewsAPI
    providers.append(lambda: fetch_newsapi_top_headlines())
    return providers

# ---------- Upsert ----------

def upsert_articles(db: Session, items: Iterable[ArticleCreate]) -> Dict[str, int]:
    inserted = 0
    skipped = 0
    for item in items:
        url = canonicalize_url(str(item.url))
        # idempotency by URL (you already have unique(url) on Article)
        existing = db.query(Article).filter(Article.url == url).first()
        if existing:
            skipped += 1
            continue
        rec = Article(
            title=item.title.strip(),
            url=url,
            source=item.source,
            content=item.content,
            published_at=_safe_dt(item.published_at),
            keywords=item.keywords,
        )
        db.add(rec)
        inserted += 1
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # race or concurrent insert of same URL: ignore those rows
    return {"inserted": inserted, "skipped": skipped}

def run_ingest(db: Session) -> Dict[str, int]:
    totals = {"fetched": 0, "inserted": 0, "skipped": 0}
    for provider in build_registry():
        try:
            items = provider()
            totals["fetched"] += len(items)
            res = upsert_articles(db, items)
            totals["inserted"] += res["inserted"]
            totals["skipped"] += res["skipped"]
        except Exception:
            # In production, log the provider error with traceback
            pass
    return totals

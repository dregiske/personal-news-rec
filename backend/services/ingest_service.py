import logging
import requests

from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException

from backend.config import settings
from backend.schemas import NewsAPIParams, NormalizedArticle
from backend.services.keywords_service import build_article_keywords
from backend.services.topics_service import infer_topics
from backend import repositories as repo


logger = logging.getLogger(__name__)


def fetch_newsapi_articles(params: NewsAPIParams) -> list[dict]:
	try:
		response = requests.get(
			settings.NEWSAPI_URL,
			params=params.model_dump(exclude_none=True),
		)
		response.raise_for_status()
	except requests.RequestException as e:
		logger.error("NewsAPI request failed: %s", e)
		raise HTTPException(status_code=502, detail="Failed to fetch articles from NewsAPI")

	return response.json().get("articles", [])


def normalize_article(raw: dict) -> NormalizedArticle | None:
	url = raw.get("url")
	if not url:
		return None

	published_at = raw.get("publishedAt")
	if published_at:
		try:
			published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
		except ValueError:
			published_at = None

	return NormalizedArticle(
		title=raw.get("title") or "Untitled",
		description=raw.get("description"),
		content=raw.get("content"),
		author=raw.get("author"),
		image_url=raw.get("urlToImage"),
		source=raw.get("source", {}).get("name"),
		url=url,
		published_at=published_at,
	)


def upsert_article(db: Session, normalized: NormalizedArticle) -> None:
	data = normalized.model_dump()
	existing = repo.article.get_by_url(db, normalized.url)
	if existing:
		repo.article.update(db, existing, data)
	else:
		repo.article.create(db, data)


def ingestion_service(db: Session, api_key: str, query: str, page_size: int) -> int:
	'''Ingest news articles into the database.

	Sets params > fetches from NewsAPI > for each article:
		normalize, extract keywords, infer topics, upsert into DB.
	Returns count of upserted articles.
	'''
	params = NewsAPIParams(q=query, pageSize=page_size, apiKey=api_key)
	raw_articles = fetch_newsapi_articles(params)

	upserted = 0
	for raw in raw_articles:
		normalized = normalize_article(raw)
		if not normalized:
			continue

		normalized.keywords = build_article_keywords(normalized.model_dump())
		normalized.topics = infer_topics(normalized.title, normalized.description, normalized.keywords)

		upsert_article(db, normalized)
		upserted += 1

	db.commit()
	return upserted

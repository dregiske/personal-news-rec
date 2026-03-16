'''
News ingestion services.
'''

import logging
import requests

from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException

from backend.config import settings
from backend.services.keywords import build_article_keywords
from backend import repositories as repo

logger = logging.getLogger(__name__)


def fetch_newsapi_articles(api_key: str, query: str, page_size: int) -> list[dict]:
	'''Fetch raw articles from NewsAPI.'''
	params = {
		"q": query,
		"pageSize": page_size,
		"apiKey": api_key
	}
	try:
		response = requests.get(settings.NEWSAPI_URL, params=params)
		response.raise_for_status()
	except requests.RequestException as e:
		logger.error("NewsAPI request failed: %s %s", e, response.text if 'response' in locals() else '')
		raise HTTPException(status_code=502, detail="Failed to fetch articles from NewsAPI")

	return response.json().get("articles", [])


def normalize_article_data(raw: dict) -> dict:
	'''Normalize a raw NewsAPI article into our Article schema fields.'''
	published_at = raw.get("publishedAt")
	if published_at:
		try:
			published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
		except ValueError:
			published_at = None

	return {
		"title": raw.get("title") or "Untitled",
		"content": raw.get("content"),
		"source": raw.get("source", {}).get("name"),
		"url": raw.get("url"),
		"published_at": published_at,
		"keywords": None,
	}


def upsert_into_database(db: Session, api_key: str, query: str, page_size: int) -> int:
	'''
	Fetch articles from NewsAPI, normalize, and upsert into the database.
	Returns the number of articles inserted or updated.
	'''
	raw_articles = fetch_newsapi_articles(api_key, query, page_size)

	upserted = 0
	for raw in raw_articles:
		normalized = normalize_article_data(raw)
		url = normalized.get("url")
		if not url:
			continue

		normalized["keywords"] = build_article_keywords(normalized)

		existing = repo.article.get_by_url(db, url)
		if existing:
			repo.article.update(db, existing, normalized)
		else:
			repo.article.create(db, normalized)

		upserted += 1

	db.commit()
	return upserted

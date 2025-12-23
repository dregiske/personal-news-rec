'''
News ingestion services.
'''

from datetime import datetime

from sqlalchemy.orm import Session
from backend.models import Article as Article 

from fastapi import HTTPException

from backend.services.keywords import build_article_keywords

def fetch_newsapi_articles(api_key, query, page_size):
	'''
	Fetch articles from News API based on a query
	'''
	import requests

	url = "https://newsapi.org/v2/everything"
	params = {
		"q": query,
		"pageSize": page_size,
		"apiKey": api_key
	}
	try:
		response = requests.get(url, params=params)
		response.raise_for_status()
	except requests.RequestException as e:
		print("NewsAPI request failed:", e, response.text if 'response' in locals() else '')
		raise HTTPException(
			status_code=502,
			detail="Failed to fetch articles from NewsAPI"
		)

	return response.json().get("articles", [])

def normalize_article_data(raw):
	'''
	Normalize raw article data from ingestion sources into
	our article database schema
	'''
	published_at = raw.get("publishedAt")
	if published_at:
		try:
			published_at = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
		except ValueError:
			published_at = None
	else:
		published_at = None

	return {
		"title": raw.get("title") or "Untitled",
		"content": raw.get("content"),
		"source": raw.get("source", {}).get("name"),
		"url": raw.get("url"),
		"published_at": published_at,
		"keywords": None, 
	}

def upsert_into_database(db: Session, api_key: str, query: str, page_size: int):
	'''
	Call fetch function and normalize data, adds
	keywords then upserts articles into the database
	- if article with same URL exists, update it
	- else, insert new article
	'''
	raw_articles = fetch_newsapi_articles(api_key, query, page_size)

	upserted = 0

	for raw in raw_articles:

		# normalize data
		normalized = normalize_article_data(raw)

		url = normalized["url"]

		if not url:
			continue # skip articles without URL

		# extract keywords
		keywords = build_article_keywords(normalized)

		# check for existing article
		existing = db.query(Article).filter(Article.url == url).first()

		if existing: # update if exists
			existing.title = normalized["title"]
			existing.content = normalized["content"]
			existing.source = normalized["source"]
			existing.published_at = normalized["published_at"]
			existing.keywords = keywords

		else: # else, insert new article
			article = Article(
				title = normalized["title"],
				content = normalized["content"],
				source = normalized["source"],
				url = normalized["url"],
				published_at = normalized["published_at"],
				keywords = keywords
			)
			db.add(article)

		upserted += 1

	db.commit()
	return upserted

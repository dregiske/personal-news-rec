'''
News ingestion services.
'''
from datetime import datetime

def fetch_newsapi_articles(api_key, query, page_size=3):
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
	response = requests.get(url, params=params)
	response.raise_for_status()
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

		# Grab keywords via extraction later
		"keywords": None 
	}

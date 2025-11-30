'''
News ingestion services.
'''

def fetch_newsapi_articles(api_key, query, page_size=3):
	'''
	Fetch articles from News API based on a query.'''
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
	
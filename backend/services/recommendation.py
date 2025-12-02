from sqlalchemy.orm import Session
from backend.models import Article, Interaction
from backend.schemas import FeedItem

from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

def article_to_text(article: Article):
	keyword_text = (article.keywords or "").replace(",", " ")
	parts = [
		article.title or "",
		article.content or "",
		keyword_text,
		keyword_text
	]
	return " ".join(parts)

def build_tfidf_model(articles: list[Article]):
	'''
	Builds a TF-IDF model from the given articles
	Run this function after ingestion to update the model
	'''
	corpus = [article_to_text(article) for article in articles]
	vectorizer = TfidfVectorizer(max_features=5000)
	tfidf_matrix = vectorizer.fit_transform(corpus)

	article_ids = [article.id for article in articles]
	id_to_index = {article_id: i for i, article_id in enumerate(article_ids)}

	joblib.dump(vectorizer, "models/tfidf_vectorizer.joblib")
	joblib.dump(tfidf_matrix, "models/tfidf_matrix.joblib")
	joblib.dump(article_ids, "models/article_ids.joblib")
	joblib.dump(id_to_index, "models/article_id_to_index.joblib")

def recommend_articles(user, db: Session, limit: int = 20, offset: int = 0):
	'''
	User-based article recommendation function
	'''
	pass
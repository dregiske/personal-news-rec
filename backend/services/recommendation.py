from sqlalchemy.orm import Session
from backend.models import Article, Interaction
from backend.schemas import FeedItem

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

import joblib

import numpy as np

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

def build_knn_index(tdidf_matrix, n_neighbors: int = 10):
	'''
	Builds a KNN index from the given TF-IDF matrix
	Run this function after ingestion to update the index
	'''
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(tdidf_matrix)

	joblib.dump(knn, "models/article_knn.joblib")


vectorizer		= joblib.load("models/tfidf_vectorizer.joblib")
tfidf_matrix	= joblib.load("models/tfidf_matrix.joblib")
article_ids		= joblib.load("models/article_ids.joblib")
id_to_index		= joblib.load("models/article_id_to_index.joblib")
knn				= joblib.load("models/article_knn.joblib")

INTERACTION_WEIGHTS = {
	"like": "2.0",
	"dislike": "-1.5",
	"view": "1.0",
}

def get_similar_articles(article_id: int, k: int = 10):
	idx = id_to_index.get(article_id)
	if idx is None:
		return []
	
	distances, indicies = knn.kneighbors(
		tfidf_matrix[idx],
		n_neighbors=k+1
	)
	distances = distances[0]
	indicies = indicies[0]
	
	results = []
	for dist, ind in zip(distances, indicies):
		if ind == idx:
			continue
		results.append((article_ids[ind], float(1 - dist)))
		if len(results) == k:
			break
	return results

def build_user_vector(user_id: int, db: Session):
	interactions = (
		db.query(Interaction)
			.filter(Interaction.user_id == user_id)
			.all()
	)
	if not interactions:
		return None
	
	vectors = []
	weights = []

	for interaction in interactions:
		w = INTERACTION_WEIGHTS.get(interaction.type, 1.0)

		idx = id_to_index.get(interaction.article_id)
		if idx is None:
			continue

		vec = tfidf_matrix[idx].toarray()[0]
		vectors.append(vec)
		weights.append(w)
	
	if not vectors:
		return None
	
	vectors = np.array(vectors)
	weights = np.array(weights)

	user_vec = (weights[:, None] * vectors).sum(axis=0) / weights.sum()
	return user_vec

def recommend_articles(user_id: int, db: Session, k: int = 20):
	'''
	User-based article recommendation function
	'''
	user_vec = build_user_vector(user_id, db)
	if user_vec is None:
		return db.query(Article).order_by(Article.published_at.desc().nullslast()).limit(limit=20).all()
	
	sims = cosine_similarity(user_vec.reshape(1, -1), tfidf_matrix)[0]

	seen_article_ids = {interaction.article_id for interaction in
		db.query(Interaction)
			.filter(Interaction.user_id == user_id)
			.all()
	}

	candidates = []
	for idx, sim in enumerate(sims):
		article_id = article_ids[idx]
		if article_id in seen_article_ids:
			continue
		candidates.append((article_id, float(sim)))

	candidates.sort(key=lambda x: x[1], reverse=True)
	return candidates[:k]
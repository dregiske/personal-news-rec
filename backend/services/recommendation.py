from sqlalchemy.orm import Session

from backend.models import Article
from backend.ml.model_registry import ModelRegistry, MODEL_DIRECTORY
from backend import repositories as repo
from backend.config import settings

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

import joblib
import os

import numpy as np

from collections import defaultdict

# ---------- INTERACTION WEIGHTS ----------
INTERACTION_WEIGHTS = {
	"like": 2.0,
	"dislike": -1.5,
	"view": 1.0,
}


def article_to_text(article: Article):
	'''
	Turn each article into a text string for TF-IDF processing
	'''
	keyword_text = (article.keywords or "").replace(",", " ")
	parts = [
		article.title or "",
		article.content or "",
		keyword_text,
		keyword_text  # doubled to increase keyword weight in TF-IDF
	]
	return " ".join(parts)


def build_tfidf_model(articles: list[Article]):
	'''
	Builds a TF-IDF model from the given articles.
	Run after ingestion to update the model.
	'''
	os.makedirs(MODEL_DIRECTORY, exist_ok=True)
	corpus = [article_to_text(article) for article in articles]
	vectorizer = TfidfVectorizer(max_features=5000)
	tfidf_matrix = vectorizer.fit_transform(corpus)

	article_ids = [article.id for article in articles]
	id_to_index = {article_id: i for i, article_id in enumerate(article_ids)}

	joblib.dump(vectorizer,    os.path.join(MODEL_DIRECTORY, "tfidf_vectorizer.joblib"))
	joblib.dump(tfidf_matrix,  os.path.join(MODEL_DIRECTORY, "tfidf_matrix.joblib"))
	joblib.dump(article_ids,   os.path.join(MODEL_DIRECTORY, "article_ids.joblib"))
	joblib.dump(id_to_index,   os.path.join(MODEL_DIRECTORY, "article_id_to_index.joblib"))

	return tfidf_matrix


def build_knn_index(tfidf_matrix, n_neighbors: int = 10):
	'''
	Builds a KNN index from the given TF-IDF matrix.
	Run after ingestion to update the index.
	'''
	os.makedirs(MODEL_DIRECTORY, exist_ok=True)
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(tfidf_matrix)
	joblib.dump(knn, os.path.join(MODEL_DIRECTORY, "article_knn.joblib"))


def get_similar_articles(article_id: int, models: ModelRegistry, k: int = 10):
	'''
	Uses KNN to find articles similar to the given article_id.
	'''
	if not models.is_ready:
		return []

	idx = models.id_to_index.get(article_id)
	if idx is None:
		return []

	distances, indices = models.knn.kneighbors(
		models.tfidf_matrix[idx],
		n_neighbors=k + 1
	)
	distances = distances[0]
	indices = indices[0]

	results = []
	for dist, ind in zip(distances, indices):
		if ind == idx:
			continue
		results.append((models.article_ids[ind], float(1 - dist)))
		if len(results) == k:
			break
	return results


def build_user_vector(user_id: int, db: Session, models: ModelRegistry):
	if not models.is_ready:
		return None

	interactions = repo.interaction.get_by_user(db, user_id)
	if not interactions:
		return None

	vectors = []
	weights = []

	for interaction in interactions:
		w = INTERACTION_WEIGHTS.get(interaction.type, 1.0)
		idx = models.id_to_index.get(interaction.article_id)
		if idx is None:
			continue
		vec = models.tfidf_matrix[idx].toarray()[0]
		vectors.append(vec)
		weights.append(w)

	if not vectors:
		return None

	vectors = np.array(vectors)
	weights = np.array(weights)
	user_vec = (weights[:, None] * vectors).sum(axis=0) / weights.sum()
	return user_vec


def hybrid_recommend_articles(
	user_id: int,
	db: Session,
	models: ModelRegistry,
	k: int = 20,
	alpha: float = settings.RECOMMENDATION_ALPHA,
	profile_candidate_cap: int = settings.RECOMMENDATION_PROFILE_CAP,
	knn_neighbors_per_seed: int = settings.RECOMMENDATION_KNN_NEIGHBORS,
):
	'''
	Hybrid recommendation combining content-based and user-based methods.
	Falls back to latest articles if models aren't ready or user has no interactions.
	'''
	def latest_articles():
		return [(a.id, 0.0) for a in repo.article.get_latest(db, limit=k)]

	if not models.is_ready:
		return latest_articles()

	interactions = repo.interaction.get_by_user(db, user_id)
	if not interactions:
		return latest_articles()

	user_vector = build_user_vector(user_id, db, models)
	if user_vector is None:
		return latest_articles()

	profile_similarities = cosine_similarity(
		user_vector.reshape(1, -1),
		models.tfidf_matrix
	)[0]

	seen_article_ids = {interaction.article_id for interaction in interactions}

	positive_seeds = [
		interaction.article_id
		for interaction in interactions
		if INTERACTION_WEIGHTS.get(interaction.type, 0) > 0
	]

	if not positive_seeds:
		candidates = [
			(models.article_ids[idx], float(sim))
			for idx, sim in enumerate(profile_similarities)
			if models.article_ids[idx] not in seen_article_ids
		]
		candidates.sort(key=lambda x: x[1], reverse=True)
		return candidates[:k]

	content_scores = defaultdict(float)
	for seed_article_id in positive_seeds:
		for sim_article_id, sim_score in get_similar_articles(seed_article_id, models, k=knn_neighbors_per_seed):
			if sim_article_id not in seen_article_ids:
				content_scores[sim_article_id] += sim_score

	profile_ranked = sorted(
		[(models.article_ids[idx], float(sim)) for idx, sim in enumerate(profile_similarities)],
		key=lambda x: x[1],
		reverse=True
	)
	profile_candidate_ids = [aid for aid, _ in profile_ranked[:profile_candidate_cap]]
	candidate_ids = set(profile_candidate_ids) | set(content_scores.keys())

	final_scores = []
	for article_id in candidate_ids:
		if article_id in seen_article_ids:
			continue
		idx = models.id_to_index.get(article_id)
		if idx is None:
			continue
		profile_score = profile_similarities[idx]
		content_score = content_scores.get(article_id, 0.0)
		combined = alpha * profile_score + (1.0 - alpha) * content_score
		final_scores.append((article_id, combined))

	final_scores.sort(key=lambda x: x[1], reverse=True)
	return final_scores[:k]

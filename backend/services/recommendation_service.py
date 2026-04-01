import os
from collections import defaultdict

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sqlalchemy.orm import Session

from backend.models import Article
from backend.ml.model_registry import ModelRegistry, MODEL_DIRECTORY
from backend import repositories as repo
from backend.constants import RECOMMENDATION_ALPHA, RECOMMENDATION_KNN_NEIGHBORS, RECOMMENDATION_PROFILE_CAP, INTERACTION_WEIGHTS, FEED_DEFAULT_LIMIT


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


def build_knn_index(tfidf_matrix, n_neighbors: int = RECOMMENDATION_KNN_NEIGHBORS):
	'''
	Builds a KNN index from the given TF-IDF matrix.
	Run after ingestion to update the index.
	'''
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

	return [
		(models.article_ids[ind], float(1 - dist))
		for dist, ind in zip(distances, indices)
		if ind != idx
	][:k]


def build_user_vector(interactions: list, models: ModelRegistry):
	if not models.is_ready:
		return None

	if not interactions:
		return None

	indices = []
	weights = []

	for interaction in interactions:
		idx = models.id_to_index.get(interaction.article_id)
		if idx is None:
			continue
		indices.append(idx)
		weights.append(INTERACTION_WEIGHTS.get(interaction.type, 1.0))

	if not indices:
		return None

	vectors = models.tfidf_matrix[indices].toarray()
	weights = np.array(weights)
	total_weight = weights.sum()
	if total_weight == 0:
		return None
	user_vec = (weights[:, None] * vectors).sum(axis=0) / total_weight
	return user_vec


def _build_content_scores(
	positive_seeds: list[int],
	seen_article_ids: set[int],
	models: ModelRegistry,
	knn_neighbors: int,
) -> defaultdict:
	content_scores = defaultdict(float)
	for seed_article_id in positive_seeds:
		for sim_article_id, sim_score in get_similar_articles(seed_article_id, models, k=knn_neighbors):
			if sim_article_id not in seen_article_ids:
				content_scores[sim_article_id] += sim_score
	return content_scores


def _rank_candidates(
	candidate_ids: set[int],
	seen_article_ids: set[int],
	profile_similarities,
	content_scores: defaultdict,
	models: ModelRegistry,
	alpha: float,
) -> list[tuple[int, float]]:
	scores = []
	for article_id in candidate_ids:
		if article_id in seen_article_ids:
			continue
		idx = models.id_to_index.get(article_id)
		if idx is None:
			continue
		combined = alpha * profile_similarities[idx] + (1.0 - alpha) * content_scores.get(article_id, 0.0)
		scores.append((article_id, combined))
	scores.sort(key=lambda x: x[1], reverse=True)
	return scores


def hybrid_recommend_articles(
	user_id: int,
	db: Session,
	models: ModelRegistry,
	k: int = FEED_DEFAULT_LIMIT,
	alpha: float = RECOMMENDATION_ALPHA,
	profile_candidate_cap: int = RECOMMENDATION_PROFILE_CAP,
	knn_neighbors_per_seed: int = RECOMMENDATION_KNN_NEIGHBORS,
):
	'''
	Hybrid recommendation combining content-based and user-based methods.
	Falls back to latest articles if models aren't ready or user has no interactions.
	'''
	if not models.is_ready:
		return [(a.id, 0.0) for a in repo.article.get_latest(db)]

	interactions = repo.interaction.get_by_user(db, user_id)
	if not interactions:
		return [(a.id, 0.0) for a in repo.article.get_latest(db)]

	user_vector = build_user_vector(interactions, models)
	if user_vector is None:
		return [(a.id, 0.0) for a in repo.article.get_latest(db)]

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
		return [
			(models.article_ids[i], float(profile_similarities[i]))
			for i in np.argsort(profile_similarities)[::-1]
			if models.article_ids[i] not in seen_article_ids
		][:k]

	content_scores = _build_content_scores(positive_seeds, seen_article_ids, models, knn_neighbors_per_seed)

	cap = min(profile_candidate_cap, len(profile_similarities))
	top_indices = np.argpartition(profile_similarities, -cap)[-cap:]
	candidate_ids = {models.article_ids[i] for i in top_indices} | set(content_scores.keys())

	return _rank_candidates(candidate_ids, seen_article_ids, profile_similarities, content_scores, models, alpha)[:k]

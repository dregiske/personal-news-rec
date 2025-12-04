from sqlalchemy.orm import Session
from backend.models import Article, Interaction

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

import joblib
import os

import numpy as np

from collections import defaultdict

MODEL_DIRECTORY = os.path.join(os.path.dirname(__file__), "..", "models")
MODEL_DIRECTORY = os.path.abspath(MODEL_DIRECTORY)

def article_to_text(article: Article):
	'''
	Turn each article into a text string for TF-IDF processing
	'''
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

	joblib.dump(vectorizer,		f"{MODEL_DIRECTORY}/tfidf_vectorizer.joblib")
	joblib.dump(tfidf_matrix,	f"{MODEL_DIRECTORY}/tfidf_matrix.joblib")
	joblib.dump(article_ids,	f"{MODEL_DIRECTORY}/article_ids.joblib")
	joblib.dump(id_to_index,	f"{MODEL_DIRECTORY}/article_id_to_index.joblib")

	return tfidf_matrix

def build_knn_index(tfidf_matrix, n_neighbors: int = 10):
	'''
	Builds a KNN index from the given TF-IDF matrix
	Run this function after ingestion to update the index
	'''
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(tfidf_matrix)

	joblib.dump(knn, f"{MODEL_DIRECTORY}/article_knn.joblib")

vectorizer		= joblib.load(f"{MODEL_DIRECTORY}/tfidf_vectorizer.joblib")
tfidf_matrix	= joblib.load(f"{MODEL_DIRECTORY}/tfidf_matrix.joblib")
article_ids		= joblib.load(f"{MODEL_DIRECTORY}/article_ids.joblib")
id_to_index		= joblib.load(f"{MODEL_DIRECTORY}/article_id_to_index.joblib")
knn				= joblib.load(f"{MODEL_DIRECTORY}/article_knn.joblib")

INTERACTION_WEIGHTS = {
	"like": 2.0,
	"dislike": -1.5,
	"view": 1.0,
}

def get_similar_articles(article_id: int, k: int = 10):
	'''
	Uses KNN to find articles similar to the given article_id
	'''
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
		return db.query(Article).order_by(Article.published_at.desc().nullslast()).limit(k).all()
	
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

def hybrid_recommend_articles(
	user_id: int,
	db: Session,
	k: int = 20,
	alpha: float = 0.7,
	profile_candidate_cap: int = 500,
	knn_neighbors_per_seed: int = 10,
):
	'''
	Hybrid recommendation combining content-based and user-based methods
	'''

	# get interactions
	interactions: list[Interaction] = (
		db.query(Interaction)
			.filter(Interaction.user_id == user_id)
			.all()
	)
	# if no interactions, fallback to latest articles
	if not interactions:
		return[
			(article.id, 0.0)
			for article in db.query(Article)
				.order_by(Article.published_at.desc().nullslast())
				.limit(k)
				.all()
		]
	
	# build user vector
	user_vector = build_user_vector(user_id, db)
	# if user vector cannot be built, fallback to latest articles
	if user_vector is None:
		return[
			(article.id, 0.0)
			for article in db.query(Article)
				.order_by(Article.published_at.desc().nullslast())
				.limit(k)
				.all()
		]

	# compute profile-based similarities to all articles
	profile_similarities = cosine_similarity(
		user_vector.reshape(1, -1),
		tfidf_matrix
	)[0] # profile_similarities[i] = similarity of article i to user profile

	seen_article_ids = {interaction.article_id for interaction in interactions}

	# apply interaction weights
	positive_seeds = []
	for interaction in interactions:
		if INTERACTION_WEIGHTS.get(interaction.type, 0) > 0:
			positive_seeds.append(interaction.article_id)
	
	if not positive_seeds:
		candidates = []
		for idx, sim in enumerate(profile_similarities):
			article_id = article_ids[idx]
			if article_id in seen_article_ids:
				continue
			candidates.append((article_id, float(sim)))
		candidates.sort(key=lambda x: x[1], reverse=True)
		return candidates[:k]

	content_scores = defaultdict(float)
	for seed_article_id in positive_seeds:
		similar_articles = get_similar_articles(
			seed_article_id,
			k=knn_neighbors_per_seed
		)
		for sim_article_id, sim_score in similar_articles:
			if sim_article_id in seen_article_ids:
				continue
			content_scores[sim_article_id] += sim_score
	
	# build cadidate  set from 
	# - top articles by profile similarity
	# - all KNN expanded neightbors
	profile_ranked = sorted(
		[(article_ids[idx], float(sim)) for idx, sim in enumerate(profile_similarities)],
		key=lambda x: x[1],
		reverse=True
	)

	profile_candidate_ids = [
		article_id for article_id, _ in profile_ranked[:profile_candidate_cap]
	]
	knn_candidate_ids = list(content_scores.keys())
	candidate_ids = set(profile_candidate_ids) | set(knn_candidate_ids)


	# final = alpha * profile + (1 - alpha) * content
	final_scores = []
	for article_id in candidate_ids:
		if article_id in seen_article_ids:
			continue

		idx = id_to_index.get(article_id)
		if idx is None:
			continue
		profile_score = profile_similarities[idx]
		content_score = content_scores.get(article_id, 0.0)
		combined = alpha * profile_score + (1.0 - alpha) * content_score
		final_scores.append((article_id, combined))

	final_scores.sort(key=lambda x: x[1], reverse=True)
	return final_scores[:k]
'''
Tests for the recommendation service.
Focuses on fallback behavior since we don't require trained model files to run tests.
'''

from datetime import datetime, timezone
from backend.models import Article
from backend.ml.model_registry import ModelRegistry
from backend.services.recommendation import hybrid_recommend_articles


def make_empty_registry() -> ModelRegistry:
	'''Returns a ModelRegistry with all models set to None (is_ready=False).
	Used to simulate a state where training hasn't been run yet.'''
	registry = ModelRegistry.__new__(ModelRegistry)
	registry.vectorizer = None
	registry.tfidf_matrix = None
	registry.article_ids = None
	registry.id_to_index = None
	registry.knn = None
	return registry


def make_article(db, title="Article", url="https://example.com/1") -> Article:
	'''Insert a minimal Article into the test DB and return it.'''
	article = Article(title=title, url=url, published_at=datetime.now(timezone.utc))
	db.add(article)
	db.commit()
	db.refresh(article)
	return article


def test_falls_back_to_latest_when_models_not_ready(db):
	'''When models are not loaded, returns latest articles with a score of 0.0.'''
	for i in range(3):
		make_article(db, title=f"Article {i}", url=f"https://example.com/{i}")

	results = hybrid_recommend_articles(user_id=1, db=db, models=make_empty_registry(), k=10)

	assert len(results) == 3
	assert all(score == 0.0 for _, score in results)


def test_falls_back_when_user_has_no_interactions(db):
	'''A user with no interaction history gets the latest articles, not an error.'''
	make_article(db)

	results = hybrid_recommend_articles(user_id=999, db=db, models=make_empty_registry(), k=10)

	assert isinstance(results, list)
	assert len(results) == 1


def test_respects_k_limit_in_fallback(db):
	'''The k parameter caps the number of results even in fallback mode.'''
	for i in range(10):
		make_article(db, title=f"Article {i}", url=f"https://example.com/{i}")

	results = hybrid_recommend_articles(user_id=1, db=db, models=make_empty_registry(), k=5)

	assert len(results) == 5


def test_returns_empty_when_no_articles(db):
	'''Returns an empty list when there are no articles in the DB at all.'''
	results = hybrid_recommend_articles(user_id=1, db=db, models=make_empty_registry(), k=20)

	assert results == []

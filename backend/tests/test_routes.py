'''
Integration tests for all HTTP routes.
Each test hits the actual FastAPI app against an in-memory DB.
'''

from datetime import datetime, timezone
from backend.models import Article


def make_article(db, title="Test Article", url="https://example.com/1") -> Article:
	'''Insert a minimal Article into the test DB and return it.'''
	article = Article(title=title, url=url, source="Test", published_at=datetime.now(timezone.utc))
	db.add(article)
	db.commit()
	db.refresh(article)
	return article


# ───────────────────────────── Auth ──────────────────────────────

class TestSignup:
	def test_success(self, client):
		'''A valid email and password creates a user and returns their profile.'''
		res = client.post("/api/v1/signup", json={"email": "new@example.com", "password": "pass123"})
		assert res.status_code == 200
		assert res.json()["email"] == "new@example.com"

	def test_duplicate_email(self, client):
		'''Signing up twice with the same email returns 409 Conflict.'''
		payload = {"email": "dup@example.com", "password": "pass123"}
		client.post("/api/v1/signup", json=payload)
		res = client.post("/api/v1/signup", json=payload)
		assert res.status_code == 409

	def test_normalizes_email(self, client):
		'''Emails are stored lowercase and stripped of whitespace.'''
		res = client.post("/api/v1/signup", json={"email": "  UPPER@Example.COM  ", "password": "pass123"})
		assert res.json()["email"] == "upper@example.com"

	def test_invalid_email_rejected(self, client):
		'''A string that is not a valid email format returns 422 Unprocessable Entity.'''
		res = client.post("/api/v1/signup", json={"email": "not-an-email", "password": "pass123"})
		assert res.status_code == 422


class TestLogin:
	def test_success(self, client):
		'''Valid credentials return a JWT access token with type "bearer".'''
		client.post("/api/v1/signup", json={"email": "user@example.com", "password": "pass123"})
		res = client.post("/api/v1/login", json={"email": "user@example.com", "password": "pass123"})
		assert res.status_code == 200
		assert "access_token" in res.json()
		assert res.json()["token_type"] == "bearer"

	def test_wrong_password(self, client):
		'''Correct email but wrong password returns 401 Unauthorized.'''
		client.post("/api/v1/signup", json={"email": "user@example.com", "password": "pass123"})
		res = client.post("/api/v1/login", json={"email": "user@example.com", "password": "wrong"})
		assert res.status_code == 401

	def test_unknown_user(self, client):
		'''Login attempt for a non-existent user returns 404 Not Found.'''
		res = client.post("/api/v1/login", json={"email": "ghost@example.com", "password": "pass123"})
		assert res.status_code == 404


class TestLogout:
	def test_success(self, client):
		'''Logout clears the session cookie and returns 200.'''
		res = client.post("/api/v1/logout")
		assert res.status_code == 200


# ───────────────────────────── Feed ──────────────────────────────

class TestFeed:
	def test_public_feed_empty(self, client):
		'''Public feed returns an empty list when there are no articles.'''
		res = client.get("/api/v1/feed")
		assert res.status_code == 200
		assert res.json() == []

	def test_public_feed_returns_articles(self, client, db):
		'''Public feed returns all articles in the DB.'''
		make_article(db, title="Article 1", url="https://example.com/1")
		make_article(db, title="Article 2", url="https://example.com/2")
		res = client.get("/api/v1/feed")
		assert res.status_code == 200
		assert len(res.json()) == 2

	def test_public_feed_respects_limit(self, client, db):
		'''The limit query param caps the number of articles returned.'''
		for i in range(5):
			make_article(db, title=f"Article {i}", url=f"https://example.com/{i}")
		res = client.get("/api/v1/feed?limit=3")
		assert len(res.json()) == 3

	def test_for_you_requires_auth(self, client):
		'''Personalized feed returns 401 for unauthenticated requests.'''
		res = client.get("/api/v1/feed/for-you")
		assert res.status_code == 401

	def test_for_you_falls_back_to_latest_when_no_interactions(self, client, db, auth_headers):
		'''With no interactions and no trained models, for-you falls back to latest articles.'''
		make_article(db, title="Fallback Article", url="https://example.com/1")
		res = client.get("/api/v1/feed/for-you", headers=auth_headers)
		assert res.status_code == 200
		assert len(res.json()) == 1


# ─────────────────────────── Interactions ────────────────────────

class TestInteractions:
	def test_requires_auth(self, client):
		'''Recording an interaction without a token returns 401.'''
		res = client.post("/api/v1/interactions/", json={"article_id": 1, "type": "like"})
		assert res.status_code == 401

	def test_invalid_type_rejected(self, client, auth_headers):
		'''An interaction type outside the allowed enum returns 422 Unprocessable Entity.'''
		res = client.post("/api/v1/interactions/", json={"article_id": 1, "type": "banana"}, headers=auth_headers)
		assert res.status_code == 422

	def test_article_not_found(self, client, auth_headers):
		'''Posting an interaction for a non-existent article returns 404.'''
		res = client.post("/api/v1/interactions/", json={"article_id": 9999, "type": "like"}, headers=auth_headers)
		assert res.status_code == 404

	def test_like_success(self, client, db, auth_headers):
		'''A "like" interaction is stored and returned with status 201.'''
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "like"}, headers=auth_headers)
		assert res.status_code == 201
		assert res.json()["type"] == "like"

	def test_dislike_success(self, client, db, auth_headers):
		'''A "dislike" interaction is accepted and stored.'''
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "dislike"}, headers=auth_headers)
		assert res.status_code == 201

	def test_view_success(self, client, db, auth_headers):
		'''A "view" interaction is accepted and stored.'''
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "view"}, headers=auth_headers)
		assert res.status_code == 201


# ──────────────────────────── Stats ──────────────────────────────

class TestStats:
	def test_requires_auth(self, client):
		'''Stats endpoint returns 401 for unauthenticated requests.'''
		res = client.get("/api/v1/me/stats")
		assert res.status_code == 401

	def test_new_user_has_zero_interactions(self, client, auth_headers):
		'''A newly created user starts with zero interactions and is not yet personalized.'''
		res = client.get("/api/v1/me/stats", headers=auth_headers)
		assert res.status_code == 200
		assert res.json()["interaction_count"] == 0
		assert res.json()["is_personalized"] is False

	def test_interaction_count_increments(self, client, db, auth_headers):
		'''interaction_count reflects the number of recorded interactions for the current user.'''
		article = make_article(db)
		client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "like"}, headers=auth_headers)
		res = client.get("/api/v1/me/stats", headers=auth_headers)
		assert res.json()["interaction_count"] == 1


# ─────────────────────────── Admin ───────────────────────────────

class TestAdminIngest:
	def test_requires_auth(self, client):
		'''Admin ingest endpoint returns 401 without a valid token.'''
		res = client.post("/api/v1/admin/ingest")
		assert res.status_code == 401

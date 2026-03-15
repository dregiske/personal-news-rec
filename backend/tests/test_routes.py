'''
Integration tests for all HTTP routes.
Each test hits the actual FastAPI app against an in-memory DB.
'''

from datetime import datetime, timezone
from backend.models import Article


def make_article(db, title="Test Article", url="https://example.com/1") -> Article:
	article = Article(title=title, url=url, source="Test", published_at=datetime.now(timezone.utc))
	db.add(article)
	db.commit()
	db.refresh(article)
	return article


# ───────────────────────────── Auth ──────────────────────────────

class TestSignup:
	def test_success(self, client):
		res = client.post("/api/v1/signup", json={"email": "new@example.com", "password": "pass123"})
		assert res.status_code == 200
		assert res.json()["email"] == "new@example.com"

	def test_duplicate_email(self, client):
		payload = {"email": "dup@example.com", "password": "pass123"}
		client.post("/api/v1/signup", json=payload)
		res = client.post("/api/v1/signup", json=payload)
		assert res.status_code == 409

	def test_normalizes_email(self, client):
		res = client.post("/api/v1/signup", json={"email": "  UPPER@Example.COM  ", "password": "pass123"})
		assert res.json()["email"] == "upper@example.com"

	def test_invalid_email_rejected(self, client):
		res = client.post("/api/v1/signup", json={"email": "not-an-email", "password": "pass123"})
		assert res.status_code == 422


class TestLogin:
	def test_success(self, client):
		client.post("/api/v1/signup", json={"email": "user@example.com", "password": "pass123"})
		res = client.post("/api/v1/login", json={"email": "user@example.com", "password": "pass123"})
		assert res.status_code == 200
		assert "access_token" in res.json()
		assert res.json()["token_type"] == "bearer"

	def test_wrong_password(self, client):
		client.post("/api/v1/signup", json={"email": "user@example.com", "password": "pass123"})
		res = client.post("/api/v1/login", json={"email": "user@example.com", "password": "wrong"})
		assert res.status_code == 401

	def test_unknown_user(self, client):
		res = client.post("/api/v1/login", json={"email": "ghost@example.com", "password": "pass123"})
		assert res.status_code == 404


class TestLogout:
	def test_success(self, client):
		res = client.post("/api/v1/logout")
		assert res.status_code == 200


# ───────────────────────────── Feed ──────────────────────────────

class TestFeed:
	def test_public_feed_empty(self, client):
		res = client.get("/api/v1/feed")
		assert res.status_code == 200
		assert res.json() == []

	def test_public_feed_returns_articles(self, client, db):
		make_article(db, title="Article 1", url="https://example.com/1")
		make_article(db, title="Article 2", url="https://example.com/2")
		res = client.get("/api/v1/feed")
		assert res.status_code == 200
		assert len(res.json()) == 2

	def test_public_feed_respects_limit(self, client, db):
		for i in range(5):
			make_article(db, title=f"Article {i}", url=f"https://example.com/{i}")
		res = client.get("/api/v1/feed?limit=3")
		assert len(res.json()) == 3

	def test_for_you_requires_auth(self, client):
		res = client.get("/api/v1/feed/for-you")
		assert res.status_code == 401

	def test_for_you_falls_back_to_latest_when_no_interactions(self, client, db, auth_headers):
		make_article(db, title="Fallback Article", url="https://example.com/1")
		res = client.get("/api/v1/feed/for-you", headers=auth_headers)
		assert res.status_code == 200
		assert len(res.json()) == 1


# ─────────────────────────── Interactions ────────────────────────

class TestInteractions:
	def test_requires_auth(self, client):
		res = client.post("/api/v1/interactions/", json={"article_id": 1, "type": "like"})
		assert res.status_code == 401

	def test_invalid_type_rejected(self, client, auth_headers):
		res = client.post("/api/v1/interactions/", json={"article_id": 1, "type": "banana"}, headers=auth_headers)
		assert res.status_code == 422

	def test_article_not_found(self, client, auth_headers):
		res = client.post("/api/v1/interactions/", json={"article_id": 9999, "type": "like"}, headers=auth_headers)
		assert res.status_code == 404

	def test_like_success(self, client, db, auth_headers):
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "like"}, headers=auth_headers)
		assert res.status_code == 201
		assert res.json()["type"] == "like"

	def test_dislike_success(self, client, db, auth_headers):
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "dislike"}, headers=auth_headers)
		assert res.status_code == 201

	def test_view_success(self, client, db, auth_headers):
		article = make_article(db)
		res = client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "view"}, headers=auth_headers)
		assert res.status_code == 201


# ──────────────────────────── Stats ──────────────────────────────

class TestStats:
	def test_requires_auth(self, client):
		res = client.get("/api/v1/me/stats")
		assert res.status_code == 401

	def test_new_user_has_zero_interactions(self, client, auth_headers):
		res = client.get("/api/v1/me/stats", headers=auth_headers)
		assert res.status_code == 200
		assert res.json()["interaction_count"] == 0
		assert res.json()["is_personalized"] is False

	def test_interaction_count_increments(self, client, db, auth_headers):
		article = make_article(db)
		client.post("/api/v1/interactions/", json={"article_id": article.id, "type": "like"}, headers=auth_headers)
		res = client.get("/api/v1/me/stats", headers=auth_headers)
		assert res.json()["interaction_count"] == 1


# ─────────────────────────── Admin ───────────────────────────────

class TestAdminIngest:
	def test_requires_auth(self, client):
		res = client.post("/api/v1/admin/ingest")
		assert res.status_code == 401

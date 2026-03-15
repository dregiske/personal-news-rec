'''
Shared test fixtures.

- Spins up an in-memory SQLite DB per test (never touches app.db)
- Overrides get_database so every route uses the test DB
- Overrides get_model_registry with an empty registry (is_ready=False)
  so recommendation tests don't depend on trained model files
'''

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base, get_database
from backend.main import app
from backend.ml.model_registry import ModelRegistry
from backend.core.dependencies import get_model_registry

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(
	TEST_DB_URL,
	connect_args={"check_same_thread": False},
	poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def make_empty_registry() -> ModelRegistry:
	'''ModelRegistry with no models loaded — forces fallback paths in recommendation service.'''
	registry = ModelRegistry.__new__(ModelRegistry)
	registry.vectorizer = None
	registry.tfidf_matrix = None
	registry.article_ids = None
	registry.id_to_index = None
	registry.knn = None
	return registry


@pytest.fixture(autouse=True)
def setup_db():
	Base.metadata.create_all(bind=engine)
	yield
	Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db(setup_db):
	session = TestingSessionLocal()
	try:
		yield session
	finally:
		session.close()


@pytest.fixture
def client(db):
	def override_db():
		yield db

	app.dependency_overrides[get_database] = override_db
	app.dependency_overrides[get_model_registry] = make_empty_registry

	with TestClient(app, raise_server_exceptions=True) as c:
		yield c

	app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
	'''Creates a test user and returns auth headers with a valid Bearer token.'''
	client.post("/api/v1/signup", json={"email": "test@example.com", "password": "testpass123"})
	res = client.post("/api/v1/login", json={"email": "test@example.com", "password": "testpass123"})
	token = res.json()["access_token"]
	return {"Authorization": f"Bearer {token}"}

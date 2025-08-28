import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models as m
from app.main import app
from app.database import get_database

@pytest.fixture(scope="function")
def client():
    # In-memory SQLite shared across threads (TestClient spawns threads)
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    # Create a clean schema for each test
    m.Base.metadata.create_all(bind=engine)

    def _get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    # Override the app's DB dependency
    app.dependency_overrides[get_database] = _get_db

    with TestClient(app) as c:
        yield c

    # Cleanup override after test
    app.dependency_overrides.clear()
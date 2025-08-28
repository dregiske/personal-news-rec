# app/tests/test_users.py

'''
TO RUN TESTS:
PYTHONPATH=. pytest -q
'''


from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models import Base
from app.database import get_database

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_test.database"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_database():
	database = TestingSessionLocal()
	try:
		yield database
	finally:
		database.close()

app.dependency_overrides[get_database] = override_get_database
client = TestClient(app)

# ----- SIGNUP TESTS -----

def test_signup():
	response = client.post("/users/signup", json={
		"email": "test@example.com", # change email to test
		"password": "examplepass"
	})
	assert response.status_code == 200
	assert response.json()["email"] == "test@example.com" # match signup email
	assert "id" in response.json()


# ----- LOGIN TESTS -----

def test_login():
	response = client.post("/users/login", json={
		"email": "test@example.com",
		"password": "examplepass"
	})
	assert response.status_code == 200

	data = response.json()
	assert "access_token" in data
	assert data["token_type"] == "bearer"
	assert data["user"]["email"] == "test@example.com"
	assert "id" in data["user"]

def test_login_not_found():
	response = client.post("/users/login", json={
		"email": "unknown@example.com",
		"password": "examplepass"
	})
	assert response.status_code == 404
	assert response.json()["detail"] == "User not found"

def test_login_wrong_pass():
	response = client.post("/users/login", json={
		"email": "test@example.com",
		"password": "wrongpass"
	})
	assert response.status_code == 401
	assert response.json()["detail"] == "Incorrect password"
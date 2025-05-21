from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# test read_root() in main
def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the News Recommendation Engine!"}

# test get_user() in main
# tests on user 42
def test_get_user():
	response = client.get("/user/42")
	assert response.status_code == 200
	assert response.json() == {"user_id": 42}


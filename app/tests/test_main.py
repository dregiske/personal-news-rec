# app/tests/test_main.py


# test read_root() in main
def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the News Recommendation Engine!"}


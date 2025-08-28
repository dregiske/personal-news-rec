# app/tests/test_users.py

'''
TO RUN TESTS:
PYTHONPATH=. pytest -q
'''

def test_signup(client):
    r = client.post("/signup/", json={
        "email": "test@example.com",
        "password": "examplepass"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_login_success(client):
    # ensure the user exists
    client.post("/signup/", json={
        "email": "login@example.com",
        "password": "examplepass"
    })
    r = client.post("/login/", json={
        "email": "login@example.com",
        "password": "examplepass"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@example.com"
    assert "id" in data["user"]

def test_login_not_found(client):
    r = client.post("/login/", json={
        "email": "unknown@example.com",
        "password": "examplepass"
    })
    assert r.status_code == 404
    assert r.json()["detail"] == "User not found"

def test_login_wrong_pass(client):
    # create the user
    client.post("/signup/", json={
        "email": "wrongpass@example.com",
        "password": "rightpass"
    })
    r = client.post("/login/", json={
        "email": "wrongpass@example.com",
        "password": "wrongpass"
    })
    assert r.status_code == 401
    assert r.json()["detail"] == "Incorrect password"

def test_articles_crud(client):
    # create article
    r = client.post("/articles/", json={"title":"Test A","url":"https://ex.org/a"})
    assert r.status_code == 201
    aid = r.json()["id"]
    # idempotent upsert by url
    r2 = client.post("/articles/", json={"title":"Test A","url":"https://ex.org/a"})
    assert r2.status_code == 201
    assert r2.json()["id"] == aid
    # list
    r3 = client.get("/articles/?q=Test")
    assert r3.status_code == 200
    assert any(a["id"] == aid for a in r3.json())

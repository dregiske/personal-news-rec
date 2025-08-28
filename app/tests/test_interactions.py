# app/tests/test_interactions.py

def test_record_interaction(client):
    # seed article
    a = client.post("/articles/", json={"title":"T","url":"https://ex.org/x"}).json()
    r = client.post("/interactions/", json={"article_id": a["id"], "type":"CLICK"})
    assert r.status_code == 204

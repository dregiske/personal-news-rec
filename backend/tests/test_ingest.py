def test_ingest_pipeline_smoke(client, monkeypatch):
    # stub provider to return one article
    from app.services import ingest as ing
    def fake_provider():
        from app.schemas import ArticleCreate
        return [ArticleCreate(title="X", url="https://ex.org/a", source="ex")]
    monkeypatch.setattr(ing, "build_registry", lambda: [fake_provider])
    r = client.post("/ingest/run")
    assert r.status_code == 200
    body = r.json()
    assert body["inserted"] == 1

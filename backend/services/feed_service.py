from sqlalchemy.orm import Session

from backend.ml.model_registry import ModelRegistry
from backend.models import Article
from backend.services.recommendation import hybrid_recommend_articles
from backend import repositories as repo


def get_latest_feed(db: Session) -> list[Article]:
    return repo.article.get_latest(db)


def get_topic_feed(db: Session, topic: str) -> list[Article]:
    return repo.article.get_by_topic(db, topic.strip().lower())


def get_personalized_feed(db: Session, user_id: int, models: ModelRegistry) -> list[Article]:
    scored = hybrid_recommend_articles(user_id=user_id, db=db, models=models)
    if not scored:
        return []

    article_ids = [article_id for article_id, _ in scored]
    articles = repo.article.get_by_ids(db, article_ids)
    article_by_id = {a.id: a for a in articles}
    return [article_by_id[aid] for aid in article_ids if aid in article_by_id]

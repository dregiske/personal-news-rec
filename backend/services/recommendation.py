from sqlalchemy.orm import Session
from app.models import Article, Interaction
from app.schemas import FeedItem

def recommend_articles(user, db: Session, limit: int = 20, offset: int = 0):
    # super simple: recommend latest articles
    query = db.query(Article).order_by(Article.published_at.desc())
    articles = query.offset(offset).limit(limit).all()

    # add dummy personalization metadata
    items = [
        FeedItem(
            id=a.id,
            title=a.title,
            url=a.url,
            summary=a.summary,
            published_at=a.published_at,
            source=a.source,
            score=1.0  # TODO: replace with ML score
        )
        for a in articles
    ]
    return items

'''
Article repository — all DB queries for the Article model live here.
'''

from sqlalchemy.orm import Session
from backend.models import Article


def get_latest(db: Session, limit: int = 20) -> list[Article]:
	return (
		db.query(Article)
		.order_by(Article.published_at.desc().nullslast())
		.limit(limit)
		.all()
	)


def get_by_id(db: Session, article_id: int) -> Article | None:
	return db.query(Article).filter(Article.id == article_id).first()


def get_by_ids(db: Session, article_ids: list[int]) -> list[Article]:
	return db.query(Article).filter(Article.id.in_(article_ids)).all()


def get_by_url(db: Session, url: str) -> Article | None:
	return db.query(Article).filter(Article.url == url).first()

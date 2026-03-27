from sqlalchemy import or_
from sqlalchemy.orm import Session
from backend.models import Article
from backend.constants import FEED_DEFAULT_LIMIT


def get_latest(db: Session, limit: int = FEED_DEFAULT_LIMIT) -> list[Article]:
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


def get_by_topics(db: Session, topics: list[str], limit: int = FEED_DEFAULT_LIMIT) -> list[Article]:
	return (
		db.query(Article)
		.filter(or_(*[Article.topics.ilike(f'%{t}%') for t in topics]))
		.order_by(Article.published_at.desc().nullslast())
		.limit(limit)
		.all()
	)


def create(db: Session, data: dict) -> Article:
	article = Article(**data)
	db.add(article)
	return article


def update(db: Session, article: Article, data: dict) -> Article:
	for field, value in data.items():
		setattr(article, field, value)
	return article


def increment_view_count(db: Session, article_id: int) -> None:
	db.query(Article).filter(Article.id == article_id).update(
		{Article.view_count: Article.view_count + 1}
	)
	db.commit()


def get_most_viewed(db: Session, limit: int = FEED_DEFAULT_LIMIT) -> list[Article]:
	return (
		db.query(Article)
		.order_by(Article.view_count.desc())
		.limit(limit)
		.all()
	)

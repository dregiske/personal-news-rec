from sqlalchemy.orm import Session
from backend.models import Article
from backend.constants import FEED_DEFAULT_LIMIT


def get_latest(db: Session) -> list[Article]:
	return (
		db.query(Article)
		.order_by(Article.published_at.desc().nullslast())
		.limit(FEED_DEFAULT_LIMIT)
		.all()
	)


def get_by_id(db: Session, article_id: int) -> Article | None:
	return db.query(Article).filter(Article.id == article_id).first()


def get_by_ids(db: Session, article_ids: list[int]) -> list[Article]:
	return db.query(Article).filter(Article.id.in_(article_ids)).all()


def get_by_url(db: Session, url: str) -> Article | None:
	return db.query(Article).filter(Article.url == url).first()


def get_by_topic(db: Session, topic: str) -> list[Article]:
	return (
		db.query(Article)
		.filter(Article.topics.ilike(f'%{topic}%'))
		.order_by(Article.published_at.desc().nullslast())
		.limit(FEED_DEFAULT_LIMIT)
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


def get_most_viewed(db: Session) -> list[Article]:
	return (
		db.query(Article)
		.order_by(Article.view_count.desc())
		.limit(FEED_DEFAULT_LIMIT)
		.all()
	)

'''
SavedArticle repository — all DB queries for the SavedArticle model live here.
'''

from sqlalchemy.orm import Session
from backend.models import SavedArticle


def get_by_user(db: Session, user_id: int) -> list[SavedArticle]:
	return (
		db.query(SavedArticle)
		.filter(SavedArticle.user_id == user_id)
		.order_by(SavedArticle.saved_at.desc())
		.all()
	)


def get_by_user_and_article(db: Session, user_id: int, article_id: int) -> SavedArticle | None:
	return (
		db.query(SavedArticle)
		.filter(SavedArticle.user_id == user_id, SavedArticle.article_id == article_id)
		.first()
	)


def create(db: Session, user_id: int, article_id: int) -> SavedArticle:
	saved = SavedArticle(user_id=user_id, article_id=article_id)
	db.add(saved)
	db.commit()
	db.refresh(saved)
	return saved


def delete(db: Session, saved: SavedArticle) -> None:
	db.delete(saved)
	db.commit()

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.models import User, SavedArticle
from backend import repositories as repo


def list_saved_articles(db: Session, user: User) -> list[SavedArticle]:
	return repo.saved_article.get_by_user(db, user.id)


def save_article(db: Session, user: User, article_id: int) -> SavedArticle:
	if not repo.article.get_by_id(db, article_id):
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

	existing = repo.saved_article.get_by_user_and_article(db, user.id, article_id)
	if existing:
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Article already saved")

	return repo.saved_article.create(db, user_id=user.id, article_id=article_id)


def delete_saved_article(db: Session, user: User, article_id: int) -> None:
	saved = repo.saved_article.get_by_user_and_article(db, user.id, article_id)
	if not saved:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved article not found")

	repo.saved_article.delete(db, saved)

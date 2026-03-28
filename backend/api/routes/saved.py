from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_database
from backend.schemas import SavedArticleOut
from backend.services.auth import get_current_user
from backend.models import User
from backend import repositories as repo


router = APIRouter()


@router.get("/me/saved", response_model=list[SavedArticleOut])
def list_saved_articles(
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	return repo.saved_article.get_by_user(db, current_user.id)


@router.post("/me/saved/{article_id}", response_model=SavedArticleOut, status_code=status.HTTP_201_CREATED)
def save_article(
	article_id: int,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	if not repo.article.get_by_id(db, article_id):
		raise HTTPException(status_code=404, detail="Article not found")

	existing = repo.saved_article.get_by_user_and_article(db, current_user.id, article_id)
	if existing:
		raise HTTPException(status_code=409, detail="Article already saved")

	return repo.saved_article.create(db, user_id=current_user.id, article_id=article_id)


@router.delete("/me/saved/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_article(
	article_id: int,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	saved = repo.saved_article.get_by_user_and_article(db, current_user.id, article_id)
	if not saved:
		raise HTTPException(status_code=404, detail="Saved article not found")

	repo.saved_article.delete(db, saved)

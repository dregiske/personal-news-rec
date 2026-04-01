from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.database import get_database
from backend.schemas import SavedArticleOut
from backend.services.auth_service import get_current_user
from backend.services import saved_service
from backend.models import User


router = APIRouter()


@router.get("/me/saved", response_model=list[SavedArticleOut])
def list_saved_articles(
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	return saved_service.list_saved_articles(db, current_user)


@router.post("/me/saved/{article_id}", response_model=SavedArticleOut, status_code=status.HTTP_201_CREATED)
def save_article(
	article_id: int,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	return saved_service.save_article(db, current_user, article_id)


@router.delete("/me/saved/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_article(
	article_id: int,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	saved_service.delete_saved_article(db, current_user, article_id)

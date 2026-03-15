'''
Feed enpoints
'''

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_database
from backend.models import Article, User as UserModel
from backend.services.auth import get_current_user
from backend.services.recommendation import hybrid_recommend_articles
from backend.ml.model_registry import ModelRegistry
from backend.core.dependencies import get_model_registry
from backend.schemas import ArticleOut

router = APIRouter()

@router.get("/feed", response_model=List[ArticleOut])
def get_feed(limit: int=20, db: Session = Depends(get_database)):
	articles = (
		db.query(Article).order_by(Article.published_at.desc().nullslast()).limit(limit).all()
	)
	return articles

@router.get("/feed/for-you", response_model=List[ArticleOut])
def get_personalized_feed(
	limit: int=20,
	db: Session = Depends(get_database),
	models: ModelRegistry = Depends(get_model_registry),
	current_user: UserModel = Depends(get_current_user),
):
	scored = hybrid_recommend_articles(
		user_id=current_user.id,
		db=db,
		models=models,
		k=limit,
	)
	if not scored:
		return []

	article_ids = [article_id for article_id, _ in scored]
	articles = db.query(Article).filter(Article.id.in_(article_ids)).all()
	article_by_id = {article.id: article for article in articles}
	return [article_by_id[aid] for aid in article_ids if aid in article_by_id]

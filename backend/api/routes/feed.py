from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_database
from backend.models import User as UserModel
from backend.services.auth import get_current_user
from backend.services.recommendation import hybrid_recommend_articles
from backend.ml.model_registry import ModelRegistry
from backend.core.dependencies import get_model_registry
from backend.schemas import ArticleOut
from backend import repositories as repo


router = APIRouter()


@router.get("/feed", response_model=List[ArticleOut])
def get_feed(db: Session = Depends(get_database)):
	return repo.article.get_latest(db)


@router.get("/feed/topics/{topic}", response_model=List[ArticleOut])
def get_feed_by_topic(
	topic: str,
	db: Session = Depends(get_database),
):
	topics = [t.strip().lower() for t in topic.split(',') if t.strip()]
	return repo.article.get_by_topics(db, topics=topics)


@router.get("/feed/for-you", response_model=List[ArticleOut])
def get_personalized_feed(
	db: Session = Depends(get_database),
	models: ModelRegistry = Depends(get_model_registry),
	current_user: UserModel = Depends(get_current_user),
):
	scored = hybrid_recommend_articles(user_id=current_user.id, db=db, models=models)
	if not scored:
		return []

	article_ids = [article_id for article_id, _ in scored]
	articles = repo.article.get_by_ids(db, article_ids)
	article_by_id = {a.id: a for a in articles}
	return [article_by_id[aid] for aid in article_ids if aid in article_by_id]

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_database
from backend.models import User as UserModel
from backend.services.auth import get_current_user
from backend.services import feed_service
from backend.ml.model_registry import ModelRegistry
from backend.core.dependencies import get_model_registry
from backend.schemas import ArticleOut


router = APIRouter()


@router.get("/feed/latest", response_model=List[ArticleOut])
def get_feed(db: Session = Depends(get_database)):
	return feed_service.get_latest_feed(db)


@router.get("/feed/topics/{topic}", response_model=List[ArticleOut])
def get_feed_by_topic(
	topic: str,
	db: Session = Depends(get_database),
):
	return feed_service.get_topic_feed(db, topic)


@router.get("/feed/for-you", response_model=List[ArticleOut])
def get_personalized_feed(
	db: Session = Depends(get_database),
	models: ModelRegistry = Depends(get_model_registry),
	current_user: UserModel = Depends(get_current_user),
):
	return feed_service.get_personalized_feed(db, current_user.id, models)

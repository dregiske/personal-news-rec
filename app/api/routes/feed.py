# app/api/routes/feed.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_database
from app.models import Article
from app.schemas import FeedItem

router = APIRouter()

@router.get("/feed/", response_model=List[FeedItem])
@router.get("/feed", response_model=List[FeedItem])
def get_feed(limit: int = 20,
			 offset: int = 0,
			 db: Session = Depends(get_database),
			 current_user: User = Depends(get_current_user)):
	items = recommend_articles(user=current_user, db=db, limit=limit, offset=offset)
	return items

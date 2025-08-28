# app/api/routes/feed.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_database
from app.models import Article
from app.schemas import ArticleOut

router = APIRouter()

@router.get("/feed/", response_model=List[ArticleOut])
def feed(db: Session = Depends(get_database)):
    # v0 baseline: latest articles (later: personalize)
    return db.query(Article).order_by(Article.published_at.desc().nullslast(), Article.id.desc()).limit(20).all()

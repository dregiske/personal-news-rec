# app/api/routes/articles.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_database
from app.models import Article
from app.schemas import ArticleOut, ArticleCreate

router = APIRouter()

@router.get("/articles/", response_model=List[ArticleOut])
@router.get("/articles", response_model=List[ArticleOut])
def list_articles(
    q: str | None = Query(default=None),
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_database)
):
    query = db.query(Article)
    if q:
        like = f"%{q}%"
        query = query.filter(Article.title.ilike(like))
    items = query.order_by(Article.published_at.desc().nullslast(), Article.id.desc()) \
                 .offset(offset).limit(limit).all()
    return items

@router.post("/articles/", response_model=ArticleOut, status_code=201)
@router.post("/articles", response_model=ArticleOut, status_code=201)
def upsert_article(payload: ArticleCreate, db: Session = Depends(get_database)):
    # simple upsert by URL
    existing = db.query(Article).filter(Article.url == str(payload.url)).first()
    if existing:
        return existing
    a = Article(**payload.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return a

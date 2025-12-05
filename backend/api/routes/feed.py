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

from backend.models import Article
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
	current_user: UserModel = Depends(get_current_user)
):
	articles = hybrid_recommend_articles(
		user_id=current_user.id,
		db=db,
		k=limit
	)
	if not articles:
		return []
	
	id_to_score = {article_id: score for article_id, score in articles}
	article_ids = list(id_to_score.keys())
	articles = (
		db.query(Article)
			.filter(Article.id.in_(article_ids))
			.all()
	)
	article_by_id = {article.id: article for article in articles}
	ordered_articles = [
		article_by_id[article_id]
		for article_id, _ in article_ids
		if article_id in article_by_id
	]
	return ordered_articles

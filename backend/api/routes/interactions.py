'''
Interaction enpoints
'''

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_database
from backend.models import Interaction, Article
from backend.schemas import InteractionCreate, InteractionOut
from backend.services.auth import get_current_user
from backend.models import User

router = APIRouter()

@router.post("/interactions", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def record_interaction(
	interaction: InteractionCreate,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user)
):
	'''
	Record a user interaction with an article
	'''
	article = db.query(Article).get(interaction.article_id)
	if not article:
		raise HTTPException(status_code=404, detail="Article not found")

	inter = Interaction(
		user_id=current_user.id,
		article_id=interaction.article_id,
		type=interaction.type
	)
	db.add(inter)
	db.commit()
	db.refresh(inter)

	return inter
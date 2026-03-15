'''
Interaction endpoints
'''

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_database
from backend.schemas import InteractionCreate, InteractionOut
from backend.services.auth import get_current_user
from backend.models import User
from backend import repositories as repo

router = APIRouter()


@router.post("/interactions", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def record_interaction(
	interaction: InteractionCreate,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	if not repo.article.get_by_id(db, interaction.article_id):
		raise HTTPException(status_code=404, detail="Article not found")

	return repo.interaction.create(
		db,
		user_id=current_user.id,
		article_id=interaction.article_id,
		interaction_type=interaction.type,
	)

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.exc import IntegrityError
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

	if interaction.type.value == "view":
		existing = repo.interaction.get_existing(db, current_user.id, interaction.article_id, interaction.type.value)
		if existing:
			return existing
		repo.article.increment_view_count(db, interaction.article_id)

	else:
		existing = repo.interaction.get_existing_reaction(db, current_user.id, interaction.article_id)
		if existing:
			if existing.type == interaction.type.value:
				return existing
			return repo.interaction.update_type(db, existing, interaction.type.value)

	try:
		return repo.interaction.create(
			db,
			user_id=current_user.id,
			article_id=interaction.article_id,
			interaction_type=interaction.type.value,
		)
	except IntegrityError:
		db.rollback()
		return repo.interaction.get_existing(
			db, current_user.id, interaction.article_id, interaction.type.value
		)


@router.delete("/interactions/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(
	article_id: int,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	existing = repo.interaction.get_existing_reaction(db, current_user.id, article_id)
	if not existing:
		raise HTTPException(status_code=404, detail="Interaction not found")
	repo.interaction.delete(db, existing)

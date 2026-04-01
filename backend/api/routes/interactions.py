from fastapi import APIRouter, Depends, status

from sqlalchemy.orm import Session

from backend.database import get_database
from backend.schemas import InteractionCreate, InteractionOut
from backend.services.auth_service import get_current_user
from backend.services import interaction_service
from backend.models import User


router = APIRouter()


@router.post("/interactions", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def record_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    return interaction_service.record_interaction(
        db, current_user.id, interaction.article_id, interaction.type.value
    )


@router.delete("/interactions/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(
    article_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user),
):
    interaction_service.delete_interaction(db, current_user.id, article_id)

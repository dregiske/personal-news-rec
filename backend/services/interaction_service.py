from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from backend.models import Interaction
from backend import repositories as repo


def record_interaction(db: Session, user_id: int, article_id: int, interaction_type: str) -> Interaction:
    if not repo.article.get_by_id(db, article_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    if interaction_type == "view":
        existing = repo.interaction.get_existing(db, user_id, article_id, interaction_type)
        if existing:
            return existing
        repo.article.increment_view_count(db, article_id)

    else:
        existing = repo.interaction.get_existing_reaction(db, user_id, article_id)
        if existing:
            if existing.type == interaction_type:
                return existing
            return repo.interaction.update_type(db, existing, interaction_type)

    try:
        return repo.interaction.create(db, user_id=user_id, article_id=article_id, interaction_type=interaction_type)
    except IntegrityError:
        db.rollback()
        return repo.interaction.get_existing(db, user_id, article_id, interaction_type)


def delete_interaction(db: Session, user_id: int, article_id: int) -> None:
    existing = repo.interaction.get_existing_reaction(db, user_id, article_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    repo.interaction.delete(db, existing)

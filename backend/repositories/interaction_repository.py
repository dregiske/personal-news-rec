from sqlalchemy.orm import Session
from backend.models import Interaction


def get_by_user(db: Session, user_id: int) -> list[Interaction]:
	return db.query(Interaction).filter(Interaction.user_id == user_id).all()


def count_by_user(db: Session, user_id: int) -> int:
	return db.query(Interaction).filter(Interaction.user_id == user_id).count()


def get_existing(db: Session, user_id: int, article_id: int, interaction_type: str) -> Interaction | None:
	return db.query(Interaction).filter(
		Interaction.user_id == user_id,
		Interaction.article_id == article_id,
		Interaction.type == interaction_type,
	).first()


def create(db: Session, user_id: int, article_id: int, interaction_type: str) -> Interaction:
	interaction = Interaction(user_id=user_id, article_id=article_id, type=interaction_type)
	db.add(interaction)
	db.commit()
	db.refresh(interaction)
	return interaction

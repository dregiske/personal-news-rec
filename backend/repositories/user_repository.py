'''
User repository — all DB queries for the User model live here.
'''

from sqlalchemy.orm import Session
from backend.models import User


def get_by_id(db: Session, user_id: int) -> User | None:
	return db.query(User).filter(User.id == user_id).first()


def get_by_email(db: Session, email: str) -> User | None:
	return db.query(User).filter(User.email == email).first()


def create(db: Session, email: str, hashed_password: str) -> User:
	user = User(email=email, hashed_password=hashed_password)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


def update(db: Session, user: User, data: dict) -> User:
	for field, value in data.items():
		setattr(user, field, value)
	db.commit()
	db.refresh(user)
	return user
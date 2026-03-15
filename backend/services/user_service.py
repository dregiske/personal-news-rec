'''
User service — business logic for auth and user management.
'''

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models import User
from backend.services.auth import hash_password, verify_password, create_access_token
from backend import repositories as repo


def signup(db: Session, email: str, password: str) -> User:
	normalized_email = email.strip().lower()

	if repo.user.get_by_email(db, normalized_email):
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

	return repo.user.create(db, email=normalized_email, hashed_password=hash_password(password))


def login(db: Session, email: str, password: str) -> tuple[User, str]:
	'''
	Validates credentials and returns the user + a fresh access token.
	'''
	user = repo.user.get_by_email(db, email)

	if not user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
	if not verify_password(password, user.hashed_password):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

	token = create_access_token(data={"sub": str(user.id)})
	return user, token

'''
User endpoints
'''

from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session

from backend.schemas import UserCreate, UserOut, LoginRequest, LoginResponse
from backend.database import get_database
from backend.models import User
from backend.services.auth import get_current_user
from backend.services import user_service
from backend import repositories as repo
from backend.config import settings
from backend.core.limiter import limiter

router = APIRouter()


@router.post("/signup", response_model=UserOut)
@limiter.limit("5/minute")
def signup(request: Request, user: UserCreate, db: Session = Depends(get_database)):
	return user_service.signup(db, email=user.email, password=user.password)


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request: Request, user: LoginRequest, response: Response, db: Session = Depends(get_database)):
	db_user, token = user_service.login(db, email=user.email, password=user.password)

	response.set_cookie(
		key="access_token",
		value=token,
		httponly=True,
		secure=settings.ENVIRONMENT == "production",
		samesite="lax",
		path="/",
	)

	return {
		"access_token": token,
		"token_type": "bearer",
		"user": {"id": db_user.id, "email": db_user.email},
	}


@router.post("/logout")
def logout(response: Response):
	response.delete_cookie(key="access_token", path="/", samesite="lax")
	return {"message": "Logged out successfully."}


@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
	return current_user


@router.get("/me/stats")
def get_user_stats(db: Session = Depends(get_database), current_user: User = Depends(get_current_user)):
	count = repo.interaction.count_by_user(db, current_user.id)
	return {
		"interaction_count": count,
		"is_personalized": count >= settings.PERSONALIZATION_THRESHOLD,
	}

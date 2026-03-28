import os
import uuid

from fastapi import APIRouter, Depends, Response, Request, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from backend.schemas import UserCreate, UserOut, UserUpdate, LoginRequest, LoginResponse, UserStats
from backend.database import get_database
from backend.models import User
from backend.services.auth import get_current_user
from backend.services import user_service
from backend import repositories as repo
from backend.config import settings
from backend.constants import PERSONALIZATION_THRESHOLD
from backend.constants import MAX_AVATAR_BYTES, ALLOWED_IMAGE_TYPES, AUTH_LIMITER
from backend.core.limiter import limiter


router = APIRouter()

AVATAR_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'static', 'avatars')


@router.post("/signup", response_model=UserOut)
@limiter.limit(AUTH_LIMITER)
def signup(
	request: Request,
	user: UserCreate,
	db: Session = Depends(get_database)
):
	return user_service.signup(db, email=user.email, password=user.password)


@router.post("/me/avatar", response_model=UserOut)
async def upload_avatar(
	file: UploadFile = File(...),
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	if file.content_type not in ALLOWED_IMAGE_TYPES:
		raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only JPEG, PNG, WebP, and GIF images are allowed")

	contents = await file.read()
	if len(contents) > MAX_AVATAR_BYTES:
		raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Avatar must be 5 MB or smaller")

	os.makedirs(AVATAR_DIR, exist_ok=True)
	ext = file.filename.rsplit('.', 1)[-1] if file.filename and '.' in file.filename else 'jpg'
	filename = f'{uuid.uuid4().hex}.{ext}'
	dest = os.path.join(AVATAR_DIR, filename)

	with open(dest, 'wb') as f:
		f.write(contents)

	avatar_url = f'/static/avatars/{filename}'
	return repo.user.update(db, current_user, {'avatar_url': avatar_url})


@router.post("/login", response_model=LoginResponse)
@limiter.limit(AUTH_LIMITER)
def login(
	request: Request,
	user: LoginRequest,
	response: Response,
	db: Session = Depends(get_database)
):
	db_user, token = user_service.login(db, email=user.email, password=user.password)

	response.set_cookie(
		key="access_token",
		value=token,
		httponly=True,
		secure=settings.ENVIRONMENT == "production",
		samesite="lax",
		path="/",
	)

	return LoginResponse(
		access_token=token,
		token_type="bearer",
		user=db_user,
	)


@router.post("/logout")
def logout(response: Response):
	response.delete_cookie(key="access_token", path="/", samesite="lax")
	return {"message": "Logged out successfully."}


@router.get("/me", response_model=UserOut)
def get_current_user_info(current_user: User = Depends(get_current_user)):
	return current_user


@router.patch("/me", response_model=UserOut)
def update_profile(
	data: UserUpdate,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	return user_service.update_profile(db, current_user, data)


@router.get("/me/stats", response_model=UserStats)
def get_user_stats(
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user)
):
	count = repo.interaction.count_by_user(db, current_user.id)
	return UserStats(
		interaction_count=count,
		is_personalized=count >= PERSONALIZATION_THRESHOLD,
	)

from fastapi import APIRouter, Depends, Response, Request, UploadFile, File
from sqlalchemy.orm import Session

from backend.schemas import UserCreate, UserOut, UserUpdate, LoginRequest, LoginResponse, UserStats, PasswordChange
from backend.database import get_database
from backend.models import User
from backend.services.auth_service import get_current_user
from backend.services import user_service
from backend.config import settings
from backend.constants import AUTH_LIMITER
from backend.core.limiter import limiter


router = APIRouter()


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
	contents = await file.read()
	return user_service.upload_avatar(db, current_user, file.content_type, file.filename, contents)


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


@router.patch("/me/password", status_code=204)
def change_password(
	data: PasswordChange,
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	user_service.change_password(db, current_user, data)


@router.delete("/me/avatar", response_model=UserOut)
def delete_avatar(
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user),
):
	return user_service.delete_avatar(db, current_user)


@router.get("/me/stats", response_model=UserStats)
def get_user_stats(
	db: Session = Depends(get_database),
	current_user: User = Depends(get_current_user)
):
	return user_service.get_stats(db, current_user.id)

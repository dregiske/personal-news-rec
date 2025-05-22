from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas import UserCreate, UserOut
from app.services.auth import hash_password
from app.models import User as UserModel
from app.database import SessionLocal, get_database

router = APIRouter()

@router.get("/")
def read_root():
	return {"message": "Welcome to the News Recommendation Engine!"}

@router.get("/user/{user_id}")
def get_user(user_id: int):
	return {"user_id": user_id}

@router.post("/signup/", response_model=UserOut)
def signup(user: UserCreate, database: Session = Depends(get_database)):
	new_user = UserModel(
		email = user.email,
		hashed_password = hash_password(user.password)
	)
	database.add(new_user)
	database.commit()
	database.refresh(new_user)
	
	return new_user
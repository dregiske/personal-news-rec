from fastapi import APIRouter
from app.schemas import UserCreate, UserOut
from app.services.auth import hash_password

router = APIRouter()

@router.get("/")
def read_root():
	return {"message": "Welcome to the News Recommendation Engine!"}

@router.get("/user/{user_id}")
def get_user(user_id: int):
	return {"user_id": user_id}

@router.post("/signup/", response_model=UserOut)
def signup(user: userCreate):
	hashed_password = hash_password(user.password)
	return {"email": user.email, "id": user_id}
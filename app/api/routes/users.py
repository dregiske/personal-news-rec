from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from app.schemas import UserCreate, UserOut, LoginRequest, LoginResponse
from app.services.auth import hash_password, verify_password, create_access_token
from app.models import User as UserModel
from app.database import SessionLocal, get_database

router = APIRouter()

@router.get("/")
def read_root():
	return {"message": "Welcome to the News Recommendation Engine!"}

@router.get("/user/{user_id}")
def get_user(user_id: int):
	return {
		"user_id": user_id
	}

'''
signup endpoint:
- initialize email / hashed pass
- add to database
'''
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

'''
login endpoint:
- checks for user in database
- throws error if not found
- creates JWT token
'''
@router.post("/login/", response_model=LoginResponse)
def login(user: LoginRequest, database: Session = Depends(get_database)):
	database_user = database.query(UserModel).filter(UserModel.email == user.email).first()
	
	if not database_user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
	if not verify_password(user.password, database_user.hashed_password):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
	
	# Create JWT token
	access_token = create_access_token(data={"user_id": database_user.id})

	return {
		"access_token": access_token,
		"token_type": "bearer",
		"user": {
			"id": database_user.id,
			"email": database_user.email
		}
	}
'''
User enpoints
'''

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.schemas import UserCreate, UserOut, LoginRequest, LoginResponse
from backend.services.auth import hash_password, verify_password, create_access_token
from backend.models import User as UserModel
from backend.database import get_database

router = APIRouter()

@router.get("/")
def home():
	return {
		"message": "Home page"
	}

@router.get("/user/{user_id}")
def get_user(user_id: int):
	return {
		"user_id": user_id
	}

@router.get("/users")
def list_users(database: Session = Depends(get_database)):
	users = database.query(UserModel).all()
	return users

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, database: Session = Depends(get_database)):
	'''
	signup endpoint:
	- check that email is unique
	- initialize email / hashed pass
	- add to database
	- sends user info back
	'''
	normalized_email = user.email.strip().lower()

	if database.query(UserModel).filter(UserModel.email == normalized_email).first():
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
	
	new_user = UserModel(
		email = normalized_email,
		hashed_password = hash_password(user.password)
	)

	database.add(new_user)
	try:
		database.commit()
	except IntegrityError:
		database.rollback()
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
	
	database.refresh(new_user)
	
	return new_user

@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest, database: Session = Depends(get_database), response: Response = None):
	'''
	login endpoint:
	- checks for user in database
	- throws error if not found
	- creates JWT token
	- send login info back
	'''
	database_user = database.query(UserModel).filter(UserModel.email == user.email).first()
	
	if not database_user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
	if not verify_password(user.password, database_user.hashed_password):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
	
	access_token = create_access_token(data={"user_id": database_user.id})

	response.set_cookie(
		key="access_token",
		value=access_token,
		httponly=True,
		secure=False,
		samesite="lax",
		path="/"
	)

	return {
		"access_token": access_token,
		"token_type": "bearer",
		"user": {
			"id": database_user.id,
			"email": database_user.email
		}
	}

@router.post("/logout")
def logout(response: Response):
	response.delete_cookie(
		key="access_token",
		path="/",
		samesite="lax"
	)
	return {
		"message": "Logged out successfully."
	}
# app/schemas.py

from pydantic import BaseModel, EmailStr, ConfigDict

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
	email: EmailStr
	password: str
	
class LoginResponse(BaseModel):
	access_token: str
	token_type: str
	user: UserOut
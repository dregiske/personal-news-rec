from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

class LoginRequest(BaseModel):
	email: EmailStr
	password: str
	
class LoginResponse(BaseModel):
	access_token: str
	token_type: str
	user: UserOut
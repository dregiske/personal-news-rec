'''
Pydantic schemas for uniform HTTP request/response models
'''

from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl
from typing import Optional
from datetime import datetime

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

class ArticleCreate(BaseModel):
	title: str
	url: HttpUrl
	content: Optional[str] = None
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	keywords: Optional[str] = None

class ArticleOut(BaseModel):
	id: int
	title: str
	url: HttpUrl
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	model_config = ConfigDict(from_attributes=True)

class InteractionCreate(BaseModel):
	article_id: int
	type: str

class InteractionOut(BaseModel):
	id: int
	user_id: int
	article_id: int
	type: str
	timestamp: datetime
	model_config = ConfigDict(from_attributes=True)
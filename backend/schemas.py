'''
Pydantic schemas for uniform HTTP request/response models
'''

from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl
from typing import Optional
from datetime import datetime
from enum import Enum


# ---------- INTERATION ----------
class InteractionType(str, Enum):
	like = "like"
	dislike = "dislike"
	view = "view"

class InteractionCreate(BaseModel):
	article_id: int
	type: InteractionType

class InteractionOut(BaseModel):
	id: int
	user_id: int
	article_id: int
	type: InteractionType
	timestamp: datetime
	model_config = ConfigDict(from_attributes=True)


# ---------- USER ----------
class UserCreate(BaseModel):
	email: EmailStr
	password: str

class UserOut(BaseModel):
	id: int
	email: EmailStr
	username: Optional[str] = None
	is_active: bool
	is_verified: bool
	avatar_url: Optional[str] = None
	preferred_topics: Optional[str] = None
	language: str
	created_at: datetime
	last_login_at: Optional[datetime] = None
	model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
	username: Optional[str] = None
	avatar_url: Optional[str] = None
	preferred_topics: Optional[str] = None
	language: Optional[str] = None

class UserStats(BaseModel):
	interaction_count: int
	is_personalized: bool


# ---------- AUTH ----------
class LoginRequest(BaseModel):
	email: EmailStr
	password: str

class LoginResponse(BaseModel):
	access_token: str
	token_type: str
	user: UserOut


# ---------- ARTICLE ----------
class ArticleCreate(BaseModel):
	title: str
	url: HttpUrl
	content: Optional[str] = None
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	keywords: Optional[str] = None
	topics: Optional[str] = None

class ArticleOut(BaseModel):
	id: int
	title: str
	url: HttpUrl
	content: Optional[str] = None
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	topics: Optional[str] = None
	view_count: int = 0
	model_config = ConfigDict(from_attributes=True)

class SavedArticleOut(BaseModel):
	id: int
	user_id: int
	article_id: int
	saved_at: datetime
	model_config = ConfigDict(from_attributes=True)


# ---------- ADMIN ----------
class HealthResponse(BaseModel):
	status: str
	uptime_seconds: int

class IngestResponse(BaseModel):
	ingested_updated: int

class ModelReloadResponse(BaseModel):
	status: str
	ready: bool
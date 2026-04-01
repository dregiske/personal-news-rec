import re

from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl, field_validator
from backend.constants import VALID_TOPICS, SUPPORTED_LANGUAGES
from typing import Optional
from datetime import datetime
from enum import Enum

_USERNAME_RE = re.compile(r'^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$')
_CONSECUTIVE_SPECIAL_RE = re.compile(r'[_-]{2,}')


# ---------- INTERACTION ----------

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
	preferred_topics: Optional[str] = None
	language: Optional[str] = None

	@field_validator('username', mode='before')
	@classmethod
	def validate_username(cls, v: object) -> object:
		if v is None:
			return v
		v = str(v).strip().lower()
		if len(v) < 3:
			raise ValueError('Username must be at least 3 characters')
		if len(v) > 32:
			raise ValueError('Username must be 32 characters or fewer')
		if _CONSECUTIVE_SPECIAL_RE.search(v):
			raise ValueError('Username cannot contain consecutive underscores or hyphens')
		if not _USERNAME_RE.match(v):
			raise ValueError('Username may only contain letters, numbers, underscores, and hyphens, and must start and end with a letter or number')
		return v

	@field_validator('preferred_topics', mode='before')
	@classmethod
	def validate_preferred_topics(cls, v: object) -> object:
		if v is None:
			return v
		topics = [t.strip().lower() for t in str(v).split(',') if t.strip()]
		invalid = [t for t in topics if t not in VALID_TOPICS]
		if invalid:
			raise ValueError(f"Invalid topics: {', '.join(invalid)}. Must be one of: {', '.join(sorted(VALID_TOPICS))}")
		return ','.join(topics)

	@field_validator('language', mode='before')
	@classmethod
	def validate_language(cls, v: object) -> object:
		if v is None:
			return v
		v = str(v).strip().lower()
		if v not in SUPPORTED_LANGUAGES:
			raise ValueError(f"Unsupported language '{v}'. Must be one of: {', '.join(sorted(SUPPORTED_LANGUAGES))}")
		return v

class UserStats(BaseModel):
	interaction_count: int
	is_personalized: bool

class PasswordChange(BaseModel):
	current_password: str
	new_password: str

	@field_validator('new_password', mode='before')
	@classmethod
	def validate_new_password(cls, v: object) -> object:
		if len(str(v)) < 8:
			raise ValueError('Password must be at least 8 characters')
		return v


# ---------- AUTH ----------

class LoginRequest(BaseModel):
	email: EmailStr
	password: str

class LoginResponse(BaseModel):
	access_token: str
	token_type: str
	user: UserOut

class TokenData(BaseModel):
	sub: str

class TokenPayload(TokenData):
	iat: int
	exp: int


# ---------- ARTICLE ----------

class ArticleCreate(BaseModel):
	title: str
	url: HttpUrl
	description: Optional[str] = None
	content: Optional[str] = None
	author: Optional[str] = None
	image_url: Optional[str] = None
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	keywords: Optional[str] = None
	topics: Optional[str] = None

class ArticleOut(BaseModel):
	id: int
	title: str
	url: HttpUrl
	description: Optional[str] = None
	content: Optional[str] = None
	author: Optional[str] = None
	image_url: Optional[str] = None
	source: Optional[str] = None
	published_at: Optional[datetime] = None
	topics: Optional[str] = None
	view_count: int = 0
	model_config = ConfigDict(from_attributes=True)

class SavedArticleOut(BaseModel):
	id: int
	user_id: int
	article_id: int
	article: ArticleOut
	saved_at: datetime
	model_config = ConfigDict(from_attributes=True)

class NormalizedArticle(BaseModel):
	title: str
	description: Optional[str] = None
	content: Optional[str] = None
	author: Optional[str] = None
	image_url: Optional[str] = None
	source: Optional[str] = None
	url: str
	published_at: Optional[datetime] = None
	keywords: Optional[str] = None
	topics: Optional[str] = None


# ---------- ADMIN ----------

class HealthResponse(BaseModel):
	status: str
	uptime_seconds: int

class IngestResponse(BaseModel):
	ingested_updated: int

class NewsAPIParams(BaseModel):
	q: str
	pageSize: int
	apiKey: str
	language: Optional[str] = None
	sortBy: Optional[str] = None

class ModelReloadResponse(BaseModel):
	status: str
	ready: bool
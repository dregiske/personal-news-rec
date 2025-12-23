'''
Env driven settings
'''

from pydantic_settings import BaseSettings

from datetime import timedelta

class Settings(BaseSettings):
	SECRET_KEY: str
	ALGORITHM: str
	ACCESS_TOKEN_EXPIRE_MINUTES: int
	RSS_SOURCES: str
	NEWSAPI_KEY: str | None = None
	DATABASE_URL: str 
	CORS_ORIGINS: str
	BACKEND_CORS_ORIGINS: str
	NEWS_QUERY: str

	class Config:
		env_file = ".env"
		env_file_encoding = "utf-8"

settings = Settings()



def access_token_expiry() -> timedelta:
	return timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
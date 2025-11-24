'''
Env driven settings (secrets, DB, URL, apikey)
'''

from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, Field
from typing import List
from datetime import timedelta

class Settings(BaseSettings):
	SECRET_KEY: str
	ALGORITHM: str
	ACCESS_TOKEN_EXPIRE_MINUTES: int
	RSS_SOURCES: str
	NEWSAPI_KEY: str | None = None
	DATABASE_URL: str 
	CORS_ORIGINS: str

	class Config:
		env_file = ".env"
		env_file_encoding = "utf-8"

settings = Settings()



def access_token_expiry() -> timedelta:
	return timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

def rss_list() -> List[str]:
	return [s.strip() for s in settings.RSS_SOURCES.split(",") if s.strip()]
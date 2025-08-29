'''
Env driven settings (secrets, DB, URL, apikey)
'''

from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, Field
from typing import List
from datetime import timedelta

class Settings(BaseSettings):
    SECRET_KEY: str = Field("dev-change-me", description="JWT signing key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RSS_SOURCES: str = ""
    NEWSAPI_KEY: str | None = None

    # Database
    DATABASE_URL: str = "sqlite:///./app.db"
    # e.g. postgresql+psycopg2://user:pass@host:5432/db

    CORS_ORIGINS: str = "" 
    # e.g. "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

def access_token_expiry() -> timedelta:
    return timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

def rss_list() -> List[str]:
    return [s.strip() for s in settings.RSS_SOURCES.split(",") if s.strip()]
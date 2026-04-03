from pydantic_settings import BaseSettings

from datetime import timedelta


class Settings(BaseSettings):
	ALGORITHM: str
	SECRET_KEY: str

	NEWSAPI_KEY: str | None = None

	CORS_ORIGINS: str

	API_PREFIX: str
	
	NEWSAPI_URL: str

	DATABASE_URL: str
	DB_PASSWORD: str

	ACCESS_TOKEN_EXPIRE_MINUTES: int

	ENVIRONMENT: str


	class Config:
		env_file = ".env"
		env_file_encoding = "utf-8"

settings = Settings()


def access_token_expiry() -> timedelta:
	return timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
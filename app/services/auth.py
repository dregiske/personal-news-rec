# app/services/auth.py

from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from app.config import settings, access_token_expiry

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    now = datetime.now(timezone.utc)
    exp = now + access_token_expiry()
    
    payload = {
        **data,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
	}
    encoded_jwt = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

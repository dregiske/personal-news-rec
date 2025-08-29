'''
Passwords are hashed using passlib (bcrypt), hash_password(), and verify_password()
Tokens are created using create_access_token(), uses timezone and emits JWT's
Reads secrets from settings, ensure no hardcoded info

FLOW:
login -> verify -> sign JWT (w/ SECRET_KEY + ALGORITHM)
'''

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings, access_token_expiry
from app.database import get_database
from app.models import User as UserModel

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==== Password Functions ====
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ==== JWT Create ====
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

# ==== OAuth2 Bearer Extraction ====
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_database),
) -> UserModel:
    '''
    - Extract Bearer token from Authorization header
    - Decode JWT
    - Load the User from DB
    - 401 if invalid/missing
    '''
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exc
        user_id = int(sub)
    except (JWTError, ValueError):
        raise credentials_exc

    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise credentials_exc
    return user
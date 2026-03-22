from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError

from passlib.context import CryptContext

from sqlalchemy.orm import Session

from backend.config import settings, access_token_expiry
from backend.database import get_database
from backend.models import User as UserModel
from backend.schemas import TokenData, TokenPayload


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
	return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
	return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: TokenData) -> str:
	now = datetime.now(timezone.utc)
	exp = now + access_token_expiry()

	payload = TokenPayload(
		sub=data.sub,
		iat=int(now.timestamp()),
		exp=int(exp.timestamp()),
	)
	return jwt.encode(payload.model_dump(), settings.SECRET_KEY, algorithm=settings.ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)

def get_current_user(
		request: Request,
		token: str | None = Depends(oauth2_scheme),
		db: Session = Depends(get_database),
) -> UserModel:
	'''
	Reads the JWT from the Authorization header (API clients) or the
	httpOnly cookie (browser). Header takes priority if both are present.
	'''
	token = token or request.cookies.get("access_token")

	credentials_exc = HTTPException(
		status_code=status.HTTP_401_UNAUTHORIZED,
		detail="Could not validate credentials",
		headers={"WWW-Authenticate": "Bearer"},
	)

	if not token:
		raise credentials_exc

	try:
		raw = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
		token_payload = TokenPayload(**raw)
		user_id = int(token_payload.sub)
	except (JWTError, ValueError, TypeError):
		raise credentials_exc

	user = db.query(UserModel).filter(UserModel.id == user_id).first()
	if not user:
		raise credentials_exc
	return user
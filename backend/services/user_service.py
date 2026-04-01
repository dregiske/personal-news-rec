import os
import uuid
import random
import string
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models import User
from backend.schemas import UserUpdate, TokenData, UserStats, PasswordChange
from backend.services.auth_service import hash_password, verify_password, create_access_token, normalize_email
from backend.constants import PERSONALIZATION_THRESHOLD, MAX_AVATAR_BYTES, ALLOWED_IMAGE_TYPES, AVATAR_DIR
from backend import repositories as repo


def _generate_unique_username(db: Session) -> str:
    '''Generate a random username that does not already exist in the database.'''
    for _ in range(10):
        suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        username = f'user_{suffix}'
        if not repo.user.get_by_username(db, username):
            return username
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not generate a unique username")


def signup(db: Session, email: str, password: str) -> User:
    normalized_email = normalize_email(email)
    if repo.user.get_by_email(db, normalized_email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    username = _generate_unique_username(db)
    hashed_password = hash_password(password)
    return repo.user.create(db, email=normalized_email, hashed_password=hashed_password, username=username)


def login(db: Session, email: str, password: str) -> tuple[User, str]:
    user = repo.user.get_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    repo.user.update(db, user, {"last_login_at": datetime.now(timezone.utc)})
    token = create_access_token(TokenData(sub=str(user.id)))
    return user, token


def update_profile(db: Session, user: User, data: UserUpdate) -> User:
    updates = {key: value for key, value in data.model_dump().items() if value is not None}
    if not updates:
        return user
    if "username" in updates and repo.user.get_by_username(db, updates["username"]):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")
    return repo.user.update(db, user, updates)


def upload_avatar(db: Session, user: User, content_type: str, filename: str | None, contents: bytes) -> User:
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only JPEG, PNG, WebP, and GIF images are allowed")
    if len(contents) > MAX_AVATAR_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Avatar must be 5 MB or smaller")

    _delete_avatar_file(user.avatar_url)

    os.makedirs(AVATAR_DIR, exist_ok=True)
    ext = filename.rsplit('.', 1)[-1] if filename and '.' in filename else 'jpg'
    dest = os.path.join(AVATAR_DIR, f'{uuid.uuid4().hex}.{ext}')

    with open(dest, 'wb') as f:
        f.write(contents)

    avatar_url = f'/static/avatars/{os.path.basename(dest)}'
    return repo.user.update(db, user, {'avatar_url': avatar_url})


def change_password(db: Session, user: User, data: PasswordChange) -> None:
    if not verify_password(data.current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")
    repo.user.update(db, user, {"hashed_password": hash_password(data.new_password)})


def _delete_avatar_file(avatar_url: str) -> None:
    '''Delete a local avatar file from disk if it exists.'''
    if avatar_url and avatar_url.startswith('/static/avatars/'):
        path = os.path.join(os.path.dirname(__file__), '..', '..', avatar_url.lstrip('/'))
        path = os.path.abspath(path)
        if os.path.isfile(path):
            os.remove(path)


def delete_avatar(db: Session, user: User) -> User:
    if not user.avatar_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No avatar to delete")
    _delete_avatar_file(user.avatar_url)
    return repo.user.update(db, user, {'avatar_url': None})


def get_stats(db: Session, user_id: int) -> UserStats:
    count = repo.interaction.count_by_user(db, user_id)
    return UserStats(
        interaction_count=count,
        is_personalized=count >= PERSONALIZATION_THRESHOLD,
    )

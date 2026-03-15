'''
SQLAlchemy ORM models and DB session
'''

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, UniqueConstraint

from datetime import datetime, timezone

from backend.database import Base
from backend.schemas import InteractionType

class User(Base):
	__tablename__ 		= "users"
	id 					= Column(Integer, primary_key=True, index=True)
	email 				= Column(String, unique=True, index=True, nullable=False)
	hashed_password 	= Column(String, nullable=False)
	created_at 			= Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Article(Base):
	__tablename__ 		= "articles"
	id 					= Column(Integer, primary_key=True)
	title 				= Column(String(512), nullable=False, index=True)
	content				= Column(Text, nullable=True)
	source				= Column(String(255), nullable=True, index=True)
	url					= Column(String(1024), unique=True, nullable=False)
	published_at 		= Column(DateTime(timezone=True), index=True, nullable=True)
	keywords			= Column(String(512), nullable=True)

class Interaction(Base):
	__tablename__ 		= "interactions"
	id 					= Column(Integer, primary_key=True)
	user_id				= Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
	article_id 			= Column(Integer, ForeignKey("articles.id"), index=True, nullable=False)
	type				= Column(Enum(InteractionType), nullable=False)
	timestamp			= Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

	__table_args__ = (
		UniqueConstraint("user_id", "article_id", "type", name="uq_user_article_type"),
	)

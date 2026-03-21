'''
SQLAlchemy ORM models and DB session
'''

from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey, Enum, UniqueConstraint

from datetime import datetime, timezone

from backend.database import Base
from backend.schemas import InteractionType

class User(Base):
	__tablename__ 		  = "users"
	id 					  = Column(Integer, primary_key=True, index=True)
	email 				  = Column(String, unique=True, index=True, nullable=False)
	hashed_password 	  = Column(String, nullable=False)
	username			  = Column(String(64), unique=True, index=True, nullable=True)
	is_active			  = Column(Boolean, default=True, nullable=False)
	is_verified			  = Column(Boolean, default=False, nullable=False)
	avatar_url			  = Column(String(1024), nullable=True)
	preferred_topics	  = Column(String(512), nullable=True)
	language			  = Column(String(10), default="en", nullable=False)
	stripe_customer_id	  = Column(String(64), unique=True, index=True, nullable=True)
	last_login_at		  = Column(DateTime(timezone=True), nullable=True)
	created_at 			  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
	updated_at			  = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Article(Base):
	__tablename__ 		= "articles"
	id 					= Column(Integer, primary_key=True)
	title 				= Column(String(512), nullable=False, index=True)
	content				= Column(Text, nullable=True)
	source				= Column(String(255), nullable=True, index=True)
	url					= Column(String(1024), unique=True, nullable=False)
	published_at 		= Column(DateTime(timezone=True), index=True, nullable=True)
	keywords			= Column(String(512), nullable=True)
	topics				= Column(String(256), nullable=True, index=True)
	view_count			= Column(Integer, default=0, nullable=False, server_default="0")

class SavedArticle(Base):
	__tablename__  = "saved_articles"
	id			   = Column(Integer, primary_key=True)
	user_id		   = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
	article_id	   = Column(Integer, ForeignKey("articles.id"), index=True, nullable=False)
	saved_at	   = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

	__table_args__ = (
		UniqueConstraint("user_id", "article_id", name="uq_user_saved_article"),
	)


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

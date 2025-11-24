'''
SQLAlchemy ORM models and DB session
'''

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey

from datetime import datetime, timezone

from backend.database import Base

class User(Base):
	__tablename__ 		= "users"
	id 					= Column(Integer, primary_key=True, index=True)
	email 				= Column(String, unique=True, index=True, nullable=False)
	hashed_password 	= Column(String, nullable=False)
	created_at 			= Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

'''
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
	type				= Column(String(32), nullable=False)
	ts 					= Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
'''
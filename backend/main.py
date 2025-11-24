'''
Create FastAPI app, mount routers and middlewares
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from backend.config import settings

from backend import models
from backend.database import engine, Base

from backend.api.routes import users
# from backend.api.routes import articles as articles_routes
# from backend.api.routes import interactions as interactions_routes
# from backend.api.routes import feed as feed_routes
# from backend.api.routes import ingest as ingest_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
	'''
	Startup / shutdown events
	'''
	# Startup actions
	Base.metadata.create_all(bind=engine)

	yield
	# Shutdown actions
	# (none)

app = FastAPI(lifespan=lifespan)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins or ["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(users.router, tags=["users"])
# app.include_router(articles_routes.router, tags=["articles"])
# app.include_router(interactions_routes.router, tags=["interactions"])
# app.include_router(feed_routes.router, tags=["feed"])
# app.include_router(ingest_routes.router, tags=["ingest"])

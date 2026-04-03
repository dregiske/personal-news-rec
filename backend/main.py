import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from contextlib import asynccontextmanager

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from backend.core.limiter import limiter

from backend.config import settings

from backend.ml.model_registry import ModelRegistry

from backend.api.routes import users
from backend.api.routes import home
from backend.api.routes import feed as feed_routes
from backend.api.routes import interactions as interactions_routes
from backend.api.routes import saved as saved_routes
from backend.api.routes.admin import ingest as admin_ingest
from backend.api.routes.admin import models as admin_models

@asynccontextmanager
async def lifespan(app: FastAPI):
	'''
	Startup / shutdown events
	'''
	app.state.models = ModelRegistry()

	yield

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), '..', 'static')
os.makedirs(static_dir, exist_ok=True)
app.mount('/static', StaticFiles(directory=static_dir), name='static')

prefix = settings.API_PREFIX

app.include_router(home.router, tags=["health"])
app.include_router(users.router, prefix=prefix, tags=["users"])
app.include_router(feed_routes.router, prefix=prefix, tags=["feed"])
app.include_router(interactions_routes.router, prefix=prefix, tags=["interactions"])
app.include_router(saved_routes.router, prefix=prefix, tags=["saved"])
app.include_router(admin_ingest.router, prefix=prefix, tags=["admin"])
app.include_router(admin_models.router, prefix=prefix, tags=["admin"])

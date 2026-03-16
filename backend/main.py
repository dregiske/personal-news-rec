'''
Create FastAPI app, mount routers and middlewares
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from backend.core.limiter import limiter

from backend.config import settings

from backend.database import engine, Base
from backend.ml.model_registry import ModelRegistry

from backend.api.routes import users
from backend.api.routes import home
from backend.api.routes import ingest as ingest_routes
from backend.api.routes import feed as feed_routes
from backend.api.routes import interactions as interactions_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
	'''
	Startup / shutdown events
	'''
	# Startup actions
	Base.metadata.create_all(bind=engine)
	app.state.models = ModelRegistry()

	yield
	# Shutdown actions
	# (none)

app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins or ["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(home.router, prefix="/api/v1", tags=["home"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(ingest_routes.router, prefix="/api/v1", tags=["ingest"])
app.include_router(feed_routes.router, prefix="/api/v1", tags=["feed"])
app.include_router(interactions_routes.router, prefix="/api/v1", tags=["interactions"])

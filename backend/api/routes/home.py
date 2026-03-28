import time

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from sqlalchemy import text
from backend.database import engine
from backend.schemas import HealthResponse


router = APIRouter()

START_TIME = time.time()


@router.get("/health", response_model=HealthResponse)
def liveness():
	return HealthResponse(status="ok", uptime_seconds=round(time.time() - START_TIME))


@router.get("/health/ready")
def readiness(request: Request):
	issues = []

	# DB check (one lightweight query)
	try:
		with engine.connect() as conn:
			conn.execute(text("SELECT 1"))
		db_status = "ok"
	except Exception as e:
		db_status = f"error: {e}"
		issues.append("db")

	# Model check
	models = request.app.state.models
	models_ready = models.is_ready
	if not models_ready:
		issues.append("models")

	status_code = 200 if not issues else 503
	return JSONResponse(
		status_code=status_code,
		content={
			"status": "ok" if not issues else "degraded",
			"db": db_status,
			"models": {"ready": models_ready},
			"uptime_seconds": round(time.time() - START_TIME),
		}
	)

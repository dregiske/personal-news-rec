'''
Ingest enpoints
'''

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from backend.database import get_database
from backend.services.ingest import upsert_into_database
from backend.services.auth import get_current_user
from backend.models import User
from backend.config import settings

router = APIRouter()


@router.post("/admin/ingest", tags=["ingest"])
def ingest_run(db: Session = Depends(get_database), _: User = Depends(get_current_user)):
	count = upsert_into_database(
		db,
		api_key=settings.NEWSAPI_KEY,
		query=settings.NEWS_QUERY,
		page_size=50
	)
	return {"ingested / updated": count}


@router.post("/admin/reload-models", tags=["ingest"])
def reload_models(request: Request, _: User = Depends(get_current_user)):
	'''Reload ML models from disk without restarting the server. Run after retraining.'''
	request.app.state.models.reload()
	return {"status": "models reloaded", "ready": request.app.state.models.is_ready}

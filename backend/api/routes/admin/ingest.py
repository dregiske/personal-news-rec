from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from backend.database import get_database
from backend.services.ingest import upsert_into_database
from backend.services.auth import get_current_user
from backend.models import User
from backend.config import settings
from backend.schemas import IngestResponse

router = APIRouter()


@router.post("/admin/ingest", tags=["ingest"], response_model=IngestResponse)
def ingest_run(db: Session = Depends(get_database), _: User = Depends(get_current_user)):
	count = upsert_into_database(
		db,
		api_key=settings.NEWSAPI_KEY,
		query=settings.NEWS_QUERY,
		page_size=settings.PAGE_SIZE
	)
	return IngestResponse(ingested_updated=count)
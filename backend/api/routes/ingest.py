'''
Ingest enpoints
'''

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_database
from backend.services.ingest import upsert_into_database
from backend.config import settings

router = APIRouter()

@router.post("/admin/ingest", tags=["ingest"])
def ingest_run(db: Session = Depends(get_database)):
	count = upsert_into_database(
		db,
		api_key=settings.NEWSAPI_KEY,
		query="technology",
		page_size=20
	)

	return {"ingested / updated": count}

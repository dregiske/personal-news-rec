'''
Ingest enpoints
'''

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_database
from app.services.ingest import run_ingest

router = APIRouter()

@router.post("/ingest/run", tags=["ingest"])
def ingest_run(db: Session = Depends(get_database)):
    return run_ingest(db)

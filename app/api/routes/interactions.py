from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_database
from app.models import Interaction, Article
from app.schemas import InteractionCreate

router = APIRouter()

@router.post("/interactions/", status_code=204)
@router.post("/interactions", status_code=204)
def record_interaction(
    body: InteractionCreate,
    db: Session = Depends(get_database),
    # TODO: pull user_id from JWT; for v0, use a fixed user 1 or add dependency
):
    user_id = 1  # replace with real auth dependency soon
    art = db.query(Article).get(body.article_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")

    inter = Interaction(user_id=user_id, article_id=body.article_id, type=body.type)
    db.add(inter); db.commit()
    return

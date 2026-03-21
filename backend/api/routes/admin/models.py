from fastapi import APIRouter, Depends, Request
from backend.services.auth import get_current_user
from backend.models import User
from backend.schemas import ModelReloadResponse

router = APIRouter()


@router.post("/admin/reload-models", tags=["ingest"], response_model=ModelReloadResponse)
def reload_models(request: Request, _: User = Depends(get_current_user)):
	'''Reload ML models from disk without restarting the server. Run after retraining.'''
	request.app.state.models.reload()
	return ModelReloadResponse(status="models reloaded", ready=request.app.state.models.is_ready)
from fastapi import Request
from backend.ml.model_registry import ModelRegistry


def get_model_registry(request: Request) -> ModelRegistry:
	return request.app.state.models
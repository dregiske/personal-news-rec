'''
ModelRegistry: loads and holds all ML models at app startup.
Stored in app.state and injected via Depends(get_model_registry).
'''

import os
import joblib
import logging

logger = logging.getLogger(__name__)

MODEL_DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))


class ModelRegistry:
	def __init__(self):
		self.vectorizer = None
		self.tfidf_matrix = None
		self.article_ids = None
		self.id_to_index = None
		self.knn = None
		self._load()

	def _load(self):
		try:
			self.vectorizer   = joblib.load(os.path.join(MODEL_DIRECTORY, "tfidf_vectorizer.joblib"))
			self.tfidf_matrix = joblib.load(os.path.join(MODEL_DIRECTORY, "tfidf_matrix.joblib"))
			self.article_ids  = joblib.load(os.path.join(MODEL_DIRECTORY, "article_ids.joblib"))
			self.id_to_index  = joblib.load(os.path.join(MODEL_DIRECTORY, "article_id_to_index.joblib"))
			self.knn          = joblib.load(os.path.join(MODEL_DIRECTORY, "article_knn.joblib"))
			logger.info("Recommendation models loaded successfully.")
		except FileNotFoundError as e:
			logger.warning(f"Recommendation models not found ({e}). Run training/train_recommender.py first.")

	def reload(self):
		'''Reload models from disk — call after retraining without restarting the server.'''
		self._load()

	@property
	def is_ready(self) -> bool:
		return all([
			self.vectorizer is not None,
			self.tfidf_matrix is not None,
			self.article_ids is not None,
			self.id_to_index is not None,
			self.knn is not None,
		])
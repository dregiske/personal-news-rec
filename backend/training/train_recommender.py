import os

from sqlalchemy.orm import Session

from backend.models import Article
from backend.database import SessionLocal
from backend.services.recommendation import build_tfidf_model, build_knn_index


def main():

	db: Session = SessionLocal()
	try:
		articles = db.query(Article).all()
		if not articles:
			print("No articles found in the database. Exiting.")
			return
		
		print(f"Building TF-IDF model from {len(articles)} articles...")
		tfidf_matrix = build_tfidf_model(articles)

		print("Building KNN index...")
		build_knn_index(tfidf_matrix)

		print("Model training complete. Models saved in 'models/' directory.")
	finally:
		db.close()

if __name__ == "__main__":
	main()
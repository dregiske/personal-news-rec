# Personalized News Recommendation Engine — Project Plan

## 1. Project Overview

Build a web application that suggests news articles tailored to each user based on (a) collaborative filtering of reading histories and (b) content-based similarity on article metadata.

### Core Features
- User Authentication
- Sign-up / Log-in
- Secure password storage (e.g., hashing)
- User Interaction Tracking
- Store what articles the user reads, likes, or skips
- Store keywords from user searches or article metadata
- News Ingestion Pipeline
- Periodically fetch or upload articles (from RSS feeds or scraping)
- Store them in a structured format with metadata
- Recommendation Engine
- Use ML (collaborative filtering, content-based filtering, or hybrid)
- Generate a list of suggested articles per user
- Frontend Interface
- Show personalized news feed
- Allow interaction (like/dislike/save/share)

## 2. Objectives
- Implement both collaborative and content-based recommendation models
- Expose a Python API (FastAPI) serving recommendations
- Build a responsive frontend (React) showing a personalized "For You" feed
- Store data in PostgreSQL and optimize queries for performance
- Deploy end-to-end in a containerized setup (Docker)

## 3. MVP Features
- User onboarding (simple sign-up/login)
- Article ingestion pipeline (static dataset or News API)
- Recording user interactions (clicks, likes, reads)
- Batch model training and nightly updates
- Endpoint: GET /recommendations?user_id=...
- Frontend: display recommended articles with title, summary, and image

## 4. Tech Stack
- Backend & ML: Python 3.10+, FastAPI, scikit-learn / surprise.psych, PySpark
- Database: PostgreSQL (ORM via SQLAlchemy)
- Frontend: React (TypeScript)
- Infrastructure: Docker, Docker-Compose, GitHub Actions CI

## 5. Data Sources
- Initial: Kaggle "All the News" dataset (NYTimes, The Huffington Post)
- Later: integrate a live News API (e.g., NewsAPI.org) for fresh articles

## 6. Setup
1) Clone github repository, and cd into project file:
```
git clone https://github.com/dregiske/personal_project.git
cd personal_project.git
```

2) Start environment:
```
python3 -m venv venv
source venv/bin/activate
```

3) Install dependencies:
```
pip install --upgrade pip
pip install -r requirements.txt
```


# FastAPI:
| Function                        | Role of FastAPI                                           |
| ------------------------------- | --------------------------------------------------------- |
| Handle user authentication      | Provide `POST /signup` and `POST /login` endpoints        |
| Expose recommendation endpoints | Serve `GET /recommendations` for logged-in users          |
| Manage articles                 | Serve `GET /articles`, `POST /article`, etc.              |
| Track user interaction          | Accept likes/views via `POST /interactions`               |
| Serve API to frontend           | React app will call FastAPI endpoints using HTTP requests |


## FILE STRUCUTURE
```
Personalized_News_Recommendation_Engine/
├── app/
│	├── api/
│	│	├── routes/
│	│	│	├── __init__.py
│	│	│	└── users.py
│	│	└── __init__.py
│	├── services/
│	│	├── __init__.py
│	│	└── auth.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_main.py
│	│	└── test_users.py
│   ├── __init__.py
│	├── database.py
│   ├── main.py
│	├── models.py
│	└── schemas.py
├── .gitignore
├── README.md
└── requirements.txt
```

## To remove `__pycache__/`:
```
find . -type d -name "__pycache__" -exec rm -r {} +
```

## Issues with x86_64, download requirements under arm64
```
	# remove current env
deactivate 2>/dev/null || true
rm -rf venv .venv

	# start new env
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```


## What to do next
Build Login Route
Verify credentials

Compare entered password against stored hash

Add Unique Email Check
Prevent duplicate users with the same email

Add Teardown Logic (optional)
Auto-clean the DB between test runs

Add JWT Authentication
So users can securely log in and receive tokens
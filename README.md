# Personalized News Recommendation Engine — Project Plan

## 1. Project Overview

This is a web application that suggests news articles tailored to each user based on:
1) Reading histories
2) Content-based similarity on article metadata
3) Interaction histories

### Core Features
- User Authentication (JWT)
- Sign-up / Log-in
- Secure password storage (hashing)
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

## 2. MVP Features
- User onboarding (simple sign-up/login)
- Article ingestion pipeline (static dataset or News API)
- Recording user interactions (clicks, likes, reads)
- Batch model training and nightly updates
- Endpoint: GET /recommendations?user_id=...
- Frontend: display recommended articles with title, summary, and image

## 3. Tech Stack
- Backend & ML: Python 3.10+, FastAPI, scikit-learn / surprise.psych, PySpark
- Database: PostgreSQL (ORM via SQLAlchemy)
- Frontend: React (TypeScript)
- Infrastructure: Docker, Docker-Compose, GitHub Actions CI

## 4. Data Sources
- Initial: Kaggle "All the News" dataset (NYTimes, The Huffington Post)
- Later: integrate a live News API (e.g., NewsAPI.org) for fresh articles

## 5. Setup
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

4) Start uvicorn app (backend)
```
uvicorn backend.main:app --reload --port 8000
```

5) Start react app (frontend)
```
cd frontend
npm install
npm run dev
```

## Demo Run:
http://127.0.0.1:8000/docs


# FastAPI:
| Function                        | Role of FastAPI                                           |
| ------------------------------- | --------------------------------------------------------- |
| Handle user authentication      | Provide `POST /signup` and `POST /login` endpoints        |
| Expose recommendation endpoints | Serve `GET /recommendations` for logged-in users          |
| Manage articles                 | Serve `GET /articles`, `POST /article`, etc.              |
| Track user interaction          | Accept likes/views via `POST /interactions`               |
| Serve API to frontend           | React app will call FastAPI endpoints using HTTP requests |


## Issues with x86_64, download requirements under arm64
1) remove current env
```
deactivate 2>/dev/null || true
rm -rf venv .venv
```
2) start new env
```
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## Flow Diagram of News Engine:
'''
[ User Browser ]
      │
      ▼
 [Next.js page.tsx]  ←─── routes in src/app/
   (e.g. /login, /feed)
      │
      │ calls functions from
      ▼
 [ api.ts ]
   (axios wrapper + TypeScript types)
      │
      │ sends HTTP request
      ▼
 [ FastAPI backend ]
   (app/main.py + routers)
      │
      │ talks to
      ▼
 [ Database ]
   (SQLAlchemy models: users, articles, interactions)
'''


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

Start simple, then iterate:

___
v0 (now): “Latest” feed (above) + record interactions.

v0.5 (fast): “Trending” = latest + sort by #interactions in last N hours.

v1 (better): content-based TF-IDF:

Add scikit-learn to requirements.txt.

Build vectors from title + content + keywords.

For a user, average vectors of interacted articles; rank candidates by cosine similarity.

Cache vectors in memory; refresh on ingest.
___
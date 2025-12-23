# Personalized News Recommendation App

## 1. Project Overview

This is a web application that suggests news articles tailored to each user based on:
1) Reading histories
2) Content-based similarity on article metadata
3) Interaction histories

### Core Features
- User Authentication (JWT)
- Sign-up / Log-in
- Oauth2 system for user authentication
- Secure password storage (hashing)
- SQLAlchemy databases storing:
	- User interactions
	- Articles
	- User information
- Store what articles the user reads, likes, or dislikes
- Grabs keywords from article content
- News ingestion using NewsAPI
- Recommendation system using ML algorithms (KNN)
- Generates recommended list of articles for user (defaults to regular feed)
- Frontend interface using React + Javascript
- REST API setup with FastAPI (backend)


## 2. Tech Stack
- Backend: Python 3.10+, FastAPI, Pydantic, JWT, Uvicorn
- Machine Learning: scikit-learn, NumPy
- Database: SQLAlchemy
- Frontend: React + Javascript
- Infrastructure: Docker, Docker-Compose, GitHub Actions CI

## 3. Data Sources
- Fetches news through NewsAPI
- Ingestion service handles normalizing metadata and storing it in database

## 4. Setup
1) Clone github repository, and cd into project file:
```
git clone https://github.com/dregiske/personal-news-rec.git
cd personal-news-rec
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

Dependencies used:
```
npm install react
npm install react-dom
npm install react-router-dom
npm install axios
```

## 5. System Design

Backend authentication
- Actual security
- Verifies password
- Creates JWT
- Validates JWT
- Controls access to protected routes

Frontend authentication (AuthContext)
- Holds user info, not JWT
- Redirects user
- Shows/hides pages
- Sends requests w/ cookies
- Purely UI + state management

Backend Responsibilities:
- Password hashing
- JWT token creation
- JWT token validation
- Cookie settings
- Access control
- DB queries
- Security logic

Frontend Responsibilities:
- UI
- Routing
- Forms
- Call backend APIs
- Keep simple “user metadata” (not secrets)
- Show different screens depending on login state

## Notes:

## Demo Run:
http://127.0.0.1:8000/docs


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

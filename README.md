# The Fray

## 1. Project Overview

This is a web application that suggests news articles tailored to each user based on:

1. Reading histories
2. Content-based similarity on article metadata
3. Interaction histories
4. Topic filtering

### Core Features

- User Authentication (JWT)
- Sign-up / Log-in
- Oauth2 system for user authentication
- Secure password storage (hashing)
- SQLAlchemy databases storing:
  - User interactions
  - Articles
  - User information
  - Saved article relations
- Store what articles the user reads, likes, or dislikes
- Grabs keywords / topics from article content
- News ingestion using NewsAPI
- Recommendation system using ML algorithms (KNN)
- Generates recommended list of articles for user (defaults to regular feed)
- Frontend interface using React + TypeScript + Tailwind CSS
- REST API setup with FastAPI (backend)

## 2. Tech Stack

- Backend: Python 3.10+, FastAPI, Pydantic, JWT, Uvicorn
- Machine Learning: scikit-learn
- Database: SQLAlchemy, PostgreSQL
- Frontend: React + TypeScript, Tailwind CSS, Axios
- Infrastructure: Nginx, Docker, Docker-Compose, GitHub Actions CI

## 3. Data Sources

- Fetches news through NewsAPI
- Ingestion service handles normalizing metadata, extracting information, and storing it in database

## 4. The Web App Domain

The Fray is live at: `www.thefraynews.com`

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

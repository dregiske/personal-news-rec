# ---- Base image ----
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies needed by psycopg2 and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (separate layer for caching)
# If requirements.txt hasn't changed, Docker reuses this cached layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY backend/ ./backend/
COPY alembic/ ./alembic/
COPY alembic.ini .
COPY static/ ./static/
COPY start.sh .
RUN chmod +x start.sh

# Expose the port uvicorn will listen on
EXPOSE 8000

# Run start.sh which runs migrations then starts the app
# JSON form ensures Docker signals (SIGTERM) reach uvicorn directly
CMD ["./start.sh"]

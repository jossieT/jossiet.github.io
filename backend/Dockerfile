# syntax=docker/dockerfile:1

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install runtime dependencies first for better layer caching.
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Dev/test tooling (also used by CI and `docker compose run`).
COPY requirements-dev.txt ./
RUN pip install -r requirements-dev.txt

COPY . .

EXPOSE 8000

# Docker Compose passes the actual command; default mirrors local dev.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

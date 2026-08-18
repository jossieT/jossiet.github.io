# System Overview

## Purpose

Phase 1 establishes the foundation for Yosef Teshome's personal portfolio and AI engineering platform: a Next.js frontend, a FastAPI backend, PostgreSQL, and Redis, orchestrated locally with Docker Compose.

## Components

### Frontend — Next.js (App Router)

- Located in `frontend/`.
- Public web application (Phase 1: placeholder homepage at `/`).
- TypeScript (strict), Tailwind CSS v4, ESLint.
- `frontend/lib/api.ts` is the single API client entry point.
- Runs on `http://localhost:3000` in development.

### Backend — FastAPI (Python 3.12)

- Located in `backend/`.
- Entry point: `backend/app/main.py` (`create_app()`).
- API version prefix `/api/v1` (configurable via `API_V1_PREFIX`).
- Health endpoints: `/health` (liveness) and `/api/v1/health/ready` (readiness).
- Interactive docs: `/docs` (Swagger UI) and `/redoc`.
- Pydantic v2 for configuration and schemas; SQLAlchemy 2.x for database access.
- Runs on `http://localhost:8000` in development (via `docker compose up`).

### Database — PostgreSQL

- Runs as a Docker Compose service (`postgres:17-alpine`).
- Primary data store for future portfolio content.
- Data persisted in the named Docker volume `postgres_data` (survives `docker compose down`).
- SQLAlchemy 2.x engine/session in `backend/app/db/`.
- Migrations managed with Alembic (`backend/alembic/`).
- pgvector support is planned for a future phase (RAG) — no vector columns in Phase 1.

### Redis

- Runs as a Docker Compose service (`redis:7-alpine`).
- Infrastructure layer for future caching, queues, sessions, and rate limiting.
- Phase 1 usage is limited to the readiness health check.

## Communication Flow

```text
Visitor
   ↓ (HTTP)
Next.js (localhost:3000)
   ↓ (HTTP /api/v1, CORS-enabled)
FastAPI (localhost:8000)
   ↓                          ↓
PostgreSQL (5432)          Redis (6379)
```

- The frontend calls backend endpoints through CORS with configurable allowed origins (`CORS_ORIGINS`).
- The backend connects to PostgreSQL via `DATABASE_URL` and Redis via `REDIS_URL`, both from environment configuration.
- Docker Compose only starts the backend after PostgreSQL and Redis pass their health checks.

## Docker / Containerization

- `docker-compose.yml` at the repo root defines the three services:
  - `postgres` — persistent volume + health check (`pg_isready`).
  - `redis` — health check (`redis-cli ping`).
  - `backend` — built from `backend/Dockerfile`, bind-mounted for live reload, port 8000.
- The frontend runs through the local Node.js development server; containerizing it is planned for a later phase.

## Configuration

All configuration comes from environment variables (root `.env`, see `.env.example`). Key variables: `APP_NAME`, `APP_ENV`, `DEBUG`, `API_V1_PREFIX`, `DATABASE_URL`, `REDIS_URL`, `CORS_ORIGINS`. Secrets must never be committed.

## Error Handling

Structured JSON error responses via FastAPI's standard `{"detail": ...}` format (see `backend/app/core/errors.py`). Validation errors return HTTP 422; unexpected errors return a logged, generic HTTP 500.

## Logging

Structured stdout logging configured in `backend/app/core/logging.py`. Startup and shutdown are logged in the lifespan handler. Full observability is planned for Phase 9.

## Testing

pytest suite in `backend/tests/` covers the health endpoint, application startup, and configuration loading. Infrastructure connectivity tests are gated behind the `RUN_INTEGRATION=1` flag. Frontend validation runs through `npm run lint` and `npm run build` in CI.

## Future AI Architecture (planned)

The AI portfolio assistant will be added in later phases:

- RAG knowledge retrieval using pgvector embeddings stored in PostgreSQL.
- AI agent/tool capabilities orchestrated through the FastAPI backend.
- Vector search over documents, project case studies, and articles.
- Redis used for caching and rate limiting.

No AI, RAG, or embeddings functionality exists in Phase 1.

## CI

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Frontend job: install → lint → build.
- Backend job: install → ruff lint → ruff format check → mypy → pytest.

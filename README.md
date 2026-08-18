# Yosef Teshome — Personal Portfolio Platform

A production-oriented personal portfolio and AI engineering platform built by **Yosef Teshome, AI Backend & Platform Engineer**.

This monorepo contains the **full-stack portfolio** — a Next.js frontend with rich project case studies and a FastAPI backend serving structured portfolio data from PostgreSQL.

**Live at:** [yosefteshome.dev](https://yosefteshome.dev) *(deployment planned)*

---

## Technology Stack

| Layer      | Technology                                                          |
|------------|---------------------------------------------------------------------|
| Frontend   | Next.js 16 (App Router), TypeScript, Vanilla CSS, ESLint           |
| Backend    | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.x, Alembic        |
| Database   | PostgreSQL 17 (Docker Compose, host port 5433)                     |
| Cache      | Redis 7 (Docker Compose)                                           |
| Container  | Docker, Docker Compose                                              |
| Testing    | pytest + httpx (backend), ESLint (frontend)                        |
| CI         | GitHub Actions (lint + type check + tests on push/PR)              |

---

## Architecture

```mermaid
flowchart LR
    V[Visitor] --> F[Next.js Frontend :3000]
    F -->|HTTP /api/v1| B[FastAPI Backend :8000]
    B --> P[(PostgreSQL :5433)]
    B --> R[(Redis :6379)]
    B -->|/health /docs /redoc| D[API Docs]
```

- **Next.js frontend** — public portfolio UI with hero, projects, articles, experience, services, contact.
- **FastAPI backend** — REST API under `/api/v1` for projects, articles, experience, skills, and contact.
- **PostgreSQL** — primary data store with Alembic migrations and seeded case study data.
- **Redis** — cache layer (used for future rate limiting and session caching).

---

## Repository Structure

```text
my-portfolio-web/
├── frontend/                    # Next.js application (App Router)
│   ├── app/                     # Pages and layouts (projects, articles, etc.)
│   ├── components/
│   │   ├── projects/            # Case study components
│   │   ├── ui/                  # Design system primitives
│   │   └── ...
│   ├── lib/                     # API client (api.ts)
│   ├── types/                   # Shared TypeScript interfaces
│   └── public/                  # Static assets
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── api/v1/              # Route handlers (projects, articles, health)
│   │   ├── core/                # Config, logging, error handling
│   │   ├── db/                  # SQLAlchemy engine and session
│   │   ├── models/              # ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── main.py              # FastAPI entry point
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # pytest test suite
│   ├── seed.py                  # Database seeder (4 full case studies)
│   ├── requirements.txt
│   └── requirements-dev.txt
├── docs/                        # Architecture docs and ADRs
├── .github/workflows/           # CI pipeline
├── docker-compose.yml           # PostgreSQL + Redis
├── .env.example                 # Environment variable reference
└── README.md
```

---

## Local Development

### Prerequisites

- **Node.js** 20+ (developed on 22.x)
- **Python** 3.12+ with `pip`
- **Docker** with Docker Compose (Docker 29+, Compose v2)

### 1. Clone and configure environment

```bash
git clone https://github.com/your-username/my-portfolio-web.git
cd my-portfolio-web
cp .env.example .env
```

### 2. Start infrastructure (PostgreSQL + Redis)

```bash
docker compose up -d
```

PostgreSQL is exposed on **host port 5433** (to avoid conflicts with any local PostgreSQL instance).
Redis runs on port **6379**.

Verify:

```bash
docker compose ps
```

### 3. Set up the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements-dev.txt
```

Apply database migrations and seed case study data:

```bash
alembic upgrade head
python seed.py
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

API available at `http://127.0.0.1:8000`.

| Endpoint | Description |
|---|---|
| `GET /health` | Liveness check |
| `GET /api/v1/health/ready` | Readiness (DB + Redis) |
| `GET /api/v1/projects` | All projects (paginated) |
| `GET /api/v1/projects/{slug}` | Full project case study |
| `GET /api/v1/articles` | All articles |
| `GET /docs` | Swagger UI |

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Portfolio available at `http://localhost:3000`.

### 5. Run backend tests

```bash
cd backend
pytest
```

Integration tests (require Docker running):

```bash
RUN_INTEGRATION=1 pytest
```

### 6. Database migrations

```bash
# Create a new migration after model changes
alembic revision --autogenerate -m "describe change"

# Apply all pending migrations
alembic upgrade head
```

### 7. Code quality

```bash
# Backend
ruff check .
ruff format --check .
mypy app tests

# Frontend
npm run lint
```

---

## Environment Variables

See `.env.example` for the full reference. The key variables:

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql+psycopg://yosef:...@localhost:5433/yosef_portfolio` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `APP_ENV` | `development` / `test` / `production` | `development` |
| `DEBUG` | Enable debug logging | `true` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |

Frontend reads `NEXT_PUBLIC_API_URL` from `frontend/.env` (defaults to `http://127.0.0.1:8000`).

---

## CI

GitHub Actions runs on every push and pull request to `main`:

- **Frontend job**: `npm ci` → `eslint` → `next build`
- **Backend job**: `pip install -r requirements-dev.txt` → `ruff check` → `ruff format --check` → `mypy` → `pytest`

---

## Implementation Status

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Platform foundation (FastAPI, Next.js, Docker, CI) | ✅ Complete |
| Phase 2 | Public portfolio UI (hero, projects, articles, contact) | ✅ Complete |
| Phase 3 | Backend API integration (PostgreSQL, seeded data) | ✅ Complete |
| Phase 4 | Professional project case studies & technical presentation | ✅ Complete |
| Phase 5 | AI portfolio assistant (RAG, pgvector) | 🔜 Planned |
| Phase 6 | Admin dashboard & analytics | 🔜 Planned |
| Phase 7 | Production deployment (CI/CD, Kubernetes/OpenShift) | 🔜 Planned |

---

## License

Proprietary — all rights reserved.

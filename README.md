# Yosef Teshome — AI Backend & Platform Engineering Portfolio

[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.12-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL 17](https://img.shields.io/badge/PostgreSQL_17-pgvector-336791?logo=postgresql)](https://github.com/pgvector/pgvector)
[![Redis 7](https://img.shields.io/badge/Redis_7-Cache_%26_Queue-DC382D?logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](#license)

A production-grade personal portfolio and interactive **Controlled AI Agent Platform** designed and engineered by **Yosef Teshome** — AI Backend & Platform Engineer specializing in **Production RAG Architectures, FastAPI Microservices, pgvector Vector Search, and Cloud-Native Infrastructure**.

**Live Platform:** [yosefteshome.dev](https://yosefteshome.dev) · **Direct Contact:** [joseteshe2017@gmail.com](mailto:joseteshe2017@gmail.com) · **LinkedIn:** [linkedin.com/in/yosef-teshome-96516b188](https://www.linkedin.com/in/yosef-teshome-96516b188/)

---

## 🌟 Executive Overview

This platform is not a template or static landing page. It is a full-stack **enterprise-grade platform** architected to demonstrate modern backend reliability, advanced AI agent workflows, and clean frontend engineering.

Visitors can explore detailed technical case studies, review career milestones, download resume artifacts, or converse with an embedded **Autonomous Controlled AI Agent** capable of searching projects, inspecting database records, querying technical case studies via semantic vector retrieval (**pgvector**), and streaming validated responses in real-time.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI["Next.js 16 App Router\n(React 19 + TypeScript + Vanilla/Tailwind CSS)"]
        ChatUI["Interactive AI Chat Panel\n(SSE Streaming + Source Badges + Status Indicators)"]
    end

    subgraph Gateway ["API & Application Layer"]
        FastAPI["FastAPI Async Backend (:8000)\n(Python 3.12 + Pydantic v2 + SQLAlchemy 2.x)"]
        RateLimiter["Redis Token Bucket Rate Limiter\n(Sliding Window Enforcement)"]
    end

    subgraph AgentEngine ["Controlled AI Agent & Orchestrator"]
        Orchestrator["Agent Orchestrator\n(Multi-Turn ReAct Loop · Max 3 Iterations)"]
        ToolRegistry["Typed Tool Registry\n(Strict Pydantic Input/Output Schemas · Timeout Wrappers)"]
        LLM["OpenRouter / Gemini 3.5 Flash / Mock\n(Function Calling API)"]
    end

    subgraph Tools ["Backend Execution Tools"]
        T1["search_projects"]
        T2["get_project"]
        T3["find_projects_by_technology"]
        T4["get_experience"]
        T5["get_services"]
        T6["search_articles"]
        T7["get_contact_information"]
        T8["search_knowledge_rag"]
    end

    subgraph Persistence ["Data & Storage Layer"]
        PG[("PostgreSQL 17 (:5433)\nRelational Tables (Projects, Articles, Skills, Experience)")]
        VectorStore[("pgvector HNSW Index\nCosine Distance Metric · 768-dim Vector Embeddings")]
        RedisStore[("Redis 7 (:6379)\nCache, Sliding Window Rate Limiting")]
    end

    %% Flows
    UI -->|HTTP REST /api/v1| FastAPI
    ChatUI -->|POST /api/v1/chat (SSE Stream)| FastAPI
    FastAPI --> RateLimiter
    RateLimiter --> RedisStore
    FastAPI --> Orchestrator
    Orchestrator <-->|Multi-turn Tool Calls| LLM
    Orchestrator --> ToolRegistry
    ToolRegistry --> T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8
    T1 & T2 & T3 & T4 & T5 & T6 & T7 --> PG
    T8 --> VectorStore
```

---

## 🚀 Key Engineering Capabilities

### 1. Controlled AI Agent & Tool Calling (Phase 7)
* **Sandboxed Tool Execution**: The LLM never touches SQL queries or system commands directly. It outputs structured JSON tool invocations that execute inside isolated, typed Python handlers.
* **8 Specialized Domain Tools**:
  * `search_projects`: Multi-attribute lookup by keywords, category, or technology tags.
  * `get_project`: Complete case study retrieval with architecture decisions, trade-offs, and metrics.
  * `find_projects_by_technology`: Maps projects matching specific tech stack items.
  * `get_experience`: Chronological career history, roles, and verified accomplishments.
  * `get_services`: Technical consulting and architectural advisory offerings.
  * `search_articles`: Engineering articles and deep-dive publications.
  * `get_contact_information`: Public contact details, availability status, and social profiles.
  * `search_knowledge_rag`: Semantic cosine similarity search over `pgvector` embeddings.
* **Real-time SSE Status Streaming**: Emits live tool status events (`{"status": "Searching projects database..."}`) and citation badges directly to the frontend.
* **Safety Guardrails**: Iteration bounds (`MAX_AGENT_ITERATIONS=3`, `MAX_TOOL_CALLS=5`, `TOOL_TIMEOUT=10s`), prompt-injection shielding, and zero-hallucination policies.

### 2. Semantic RAG & Vector Retrieval (Phase 6)
* **PostgreSQL + `pgvector`**: High-performance HNSW vector index with cosine similarity search over chunked markdown case studies, articles, and career data.
* **Automated Ingestion Pipeline**: Content-hash change detection (`app/services/rag/ingest.py`) generating 768-dimensional normalized embeddings with batch upsert capabilities.

### 3. In-Depth Engineering Case Studies (Phase 4)
* **Deep Case Studies**: Comprehensive breakdowns covering architectural blueprints, problem context, engineered solutions, database indexing strategies, challenge resolutions, security/reliability measures, and quantitative metrics.
* **Interactive UI**: Case study sticky navigation, architecture diagram visualizers, technology breakdown cards, and challenge-solution cards.

### 4. Smart CV & Asset Routing
* **Self-Healing Resume Route (`/resume` & `/cv`)**: Checks for locally hosted static PDF files with automatic seamless fallback to direct cloud storage downloads.

---

## 🛠️ Core Engineering Stack

```text
├── Languages
│   ├── Python 3.12+
│   ├── TypeScript
│   ├── JavaScript
│   └── SQL
│
├── Backend & APIs
│   ├── FastAPI (Async ASGI)
│   ├── NestJS / Node.js
│   ├── RESTful APIs
│   ├── Pydantic v2
│   ├── SQLAlchemy 2.x
│   └── Prisma
│
├── Frontend & Mobile
│   ├── Next.js 16 (App Router)
│   ├── React 19
│   ├── Tailwind CSS & Vanilla CSS Design Tokens
│   └── Flutter / Dart
│
├── Data & AI Engineering
│   ├── PostgreSQL 17
│   ├── Redis 7 (Caching & Rate Limiting)
│   ├── pgvector (HNSW Indexing)
│   ├── RAG Architectures & Vector Search
│   ├── LLM Orchestration (OpenRouter, Gemini, OpenAI)
│   ├── AI Agents & Function Calling
│   └── Text Embeddings
│
├── Cloud & Infrastructure
│   ├── Docker & Docker Compose
│   ├── Kubernetes
│   ├── Red Hat OpenShift
│   ├── Amazon Web Services (AWS)
│   ├── Linux (Ubuntu, RHEL)
│   └── Nginx (Reverse Proxy & Web Server)
│
└── DevOps & Tooling
    ├── Git
    ├── GitHub Actions (CI/CD)
    └── Automated Testing (pytest, ESLint, TypeScript)
```

---

## 📂 Repository Structure

```text
my-portfolio-web/
├── frontend/                         # Next.js 16 App Router Frontend
│   ├── app/                          # File-system routes (/, /projects, /experience, /articles, /resume, /cv)
│   ├── components/
│   │   ├── chat/                     # AI Chat widget, panel, message list, streaming indicators
│   │   ├── hero/                     # Hero section, Architecture diagram, Core Tech Strip
│   │   ├── home/                     # Timeline, Services, Approach, Selected projects
│   │   ├── layout/                   # Navbar (desktop/mobile), Footer, Theme toggle
│   │   ├── projects/                 # Deep case study components, visualizers, tech breakdown
│   │   └── ui/                       # Design system primitives (Cards, Badges, Buttons)
│   ├── lib/                          # Typed API client, SSE stream reader
│   └── types/                        # TypeScript domain interfaces
│
├── backend/                          # FastAPI Python Backend
│   ├── app/
│   │   ├── api/v1/                   # REST endpoints (/projects, /experience, /skills, /chat, /health)
│   │   ├── core/                     # Configuration, CORS, security, rate limiters
│   │   ├── db/                       # SQLAlchemy engine, session lifecycle, base model
│   │   ├── models/                   # PostgreSQL ORM models (Project, Article, Experience, KnowledgeChunk)
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   └── services/
│   │       ├── ai/                   # AI Agent Orchestrator, Tool Registry, LLM clients, Telemetry
│   │       │   └── tools/            # 8 Typed Domain Tool Schemas & Handlers
│   │       └── rag/                  # Chunking, Embeddings, Ingestion, and Vector Retriever
│   ├── alembic/                      # Database schema migrations (including pgvector HNSW migration)
│   ├── tests/                        # Comprehensive pytest test suite (36 tests)
│   └── seed.py                       # Idempotent database seeder with rich case studies
│
├── docs/                             # Architecture documentation
│   └── architecture/
│       └── ai-agent.md               # Controlled AI Agent & Tool Registry Specification
│
├── docker-compose.yml                # PostgreSQL 17 (pgvector) + Redis 7 services
├── .env.example                      # Template for backend & frontend environment variables
└── README.md                         # Project documentation
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
* **Node.js** 20+ (Node 22 LTS recommended)
* **Python** 3.12+
* **Docker** & **Docker Compose**

---

### 1. Clone & Configure Environment

```bash
git clone https://github.com/jossieT/jossiet.github.io.git my-portfolio-web
cd my-portfolio-web
cp .env.example .env
```

Create `backend/.env`:
```ini
APP_ENV=development
DEBUG=true
DATABASE_URL=postgresql+psycopg://yosef:yosef_dev_password@localhost:5433/yosef_portfolio
REDIS_URL=redis://localhost:6379/0
LLM_API_KEY=your_openrouter_or_gemini_key
LLM_MODEL=google/gemini-3.5-flash
EMBEDDING_MODEL=openai/text-embedding-3-small
MAX_AGENT_ITERATIONS=3
MAX_TOOL_CALLS=5
TOOL_TIMEOUT=10
```

---

### 2. Launch Infrastructure (PostgreSQL 17 + Redis 7)

```bash
docker compose up -d
```
* PostgreSQL is exposed on **port 5433** with the `pgvector` extension enabled.
* Redis is exposed on **port 6379**.

---

### 3. Setup & Seed Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run migrations, seed database & index pgvector chunks
alembic upgrade head
python seed.py
python -m app.services.rag.ingest

# Start backend dev server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
* **Swagger API Docs**: `http://127.0.0.1:8000/docs`
* **Health Check**: `http://127.0.0.1:8000/health`

---

### 4. Setup & Launch Frontend

```bash
cd ../frontend
npm install
npm run dev
```
* **Portfolio Application**: `http://localhost:3000`

---

## 🧪 Testing & Code Quality

### Backend Test Suite (Pytest)
```bash
cd backend
pytest tests/ -v
```
```text
tests/test_agent_orchestrator.py ....                                    [ 11%]
tests/test_agent_tools.py ..........                                     [ 38%]
tests/test_app.py ...                                                    [ 47%]
tests/test_chat.py .....                                                 [ 61%]
tests/test_config.py ...                                                 [ 69%]
tests/test_health.py .                                                   [ 72%]
tests/test_projects.py ....                                              [ 91%]
tests/test_rag.py ...                                                    [100%]
============================== 33 passed in 17.06s ==============================
```

### Frontend Build & Linting
```bash
cd frontend
npm run lint
npm run build
```
* 21/21 routes statically compiled and optimized with **0 errors**.

---

## 📊 Roadmap & Project Phases

| Phase | Milestone | Status |
|---|---|---|
| **Phase 1** | Platform Foundation (FastAPI, Next.js, Docker, Theme Engine) | ✅ Complete |
| **Phase 2** | Public Portfolio UI (Responsive Layout, Badges, Navigation) | ✅ Complete |
| **Phase 3** | FastAPI + PostgreSQL Backend Integration | ✅ Complete |
| **Phase 4** | Professional Project Case Studies & Interactive Visualizers | ✅ Complete |
| **Phase 5** | AI Portfolio Assistant (Context Generation & SSE Streaming) | ✅ Complete |
| **Phase 6** | RAG Knowledge Retrieval & Vector Embeddings (`pgvector` HNSW) | ✅ Complete |
| **Phase 7** | Controlled AI Agent + Multi-Turn Tool Calling & Observability | ✅ Complete |
| **Phase 8** | Production Deployment (CI/CD, Kubernetes/OpenShift) | 🔜 In Progress |

---

## 👤 About the Engineer

**Yosef Teshome**  
*AI Backend & Platform Engineer*

* **Core Focus**: High-concurrency async backends, distributed systems, production RAG pipelines, pgvector search, and autonomous multi-step AI agent workflows.
* **Email**: [joseteshe2017@gmail.com](mailto:joseteshe2017@gmail.com)
* **Phone**: `+251 977 784 658`
* **Location**: Addis Ababa, Ethiopia *(Available for Global Remote Roles & Strategic Consulting)*
* **GitHub**: [github.com/jossieT](https://github.com/jossieT)
* **LinkedIn**: [linkedin.com/in/yosef-teshome-96516b188](https://www.linkedin.com/in/yosef-teshome-96516b188/)

---

## 📄 License

Proprietary © Yosef Teshome. All rights reserved.

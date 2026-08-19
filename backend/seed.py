#!/usr/bin/env python3
"""
Database seed script for the Yosef Teshome portfolio.

Run this script AFTER applying Alembic migrations:

    alembic upgrade head
    python seed.py

The script is idempotent — running it a second time updates existing rows
rather than creating duplicates (upsert via slug).
"""

from __future__ import annotations

import sys

from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.article import Article
from app.models.experience import Experience
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill, SkillCategory

# ---------------------------------------------------------------------------
# Project data
# ---------------------------------------------------------------------------
PROJECTS = [
    {
        "slug": "enterprise-ai-knowledge-platform",
        "title": "Enterprise AI Knowledge Platform (RAG)",
        "tagline": "Production RAG platform with hybrid search & granular access control",
        "summary": (
            "A high-throughput RAG system enabling real-time semantic document search across "
            "internal repositories with pgvector, BM25 hybrid ranking, and document-level RBAC."
        ),
        "category": "ai-engineering",
        "category_label": "AI & RAG Engineering",
        "technologies": [
            "Python 3.12", "FastAPI", "PostgreSQL 17", "pgvector", "Redis",
            "Docker", "LlamaIndex", "OpenAI API", "Tailwind CSS",
        ],
        "featured": True,
        "role": "Lead AI Backend Engineer",
        "timeline": "3 Months",
        "status": "In Production",
        "impact_metrics": [
            "Sub-400ms end-to-end retrieval latency",
            "94.2% semantic precision score",
            "Zero data leak across role partitions",
        ],
        "github_url": "https://github.com/jossieT",
        "live_url": None,
        "overview": (
            "The Enterprise AI Knowledge Platform was engineered to solve knowledge fragmentation "
            "across multi-department enterprise repositories. By pairing PostgreSQL 17's pgvector extension "
            "with BM25 lexical keyword matching through Reciprocal Rank Fusion (RRF), the system delivers "
            "precise, source-attributed responses while strictly enforcing document-level role-based access controls."
        ),
        "problem": (
            "Internal technical teams spent excessive time manually cross-referencing dispersed architectural specs, "
            "incident postmortems, and compliance protocols. Standard vector-only RAG pipelines frequently produced "
            "false positives on exact technical terms (error codes, internal acronyms) and lacked granular data permission boundaries."
        ),
        "solution": (
            "Architected an asynchronous FastAPI backend integrating a dual-stage retrieval engine: semantic dense "
            "embeddings (OpenAI text-embedding-3-small) indexed via HNSW in pgvector, combined with PostgreSQL full-text tsvector "
            "search. Injected row-level security tokens into SQL execution contexts to guarantee that generated contexts only contain "
            "passages authorized for the querying user."
        ),
        "architecture_mermaid": (
            "flowchart TD\n"
            "    subgraph Ingestion [Ingestion Pipeline]\n"
            "        Doc[Raw Docs / Markdown] --> Chunk[Semantic Markdown Splitter]\n"
            "        Chunk --> Embed[Embedding Generator: text-embedding-3-small]\n"
            "        Embed --> PG[(PostgreSQL 17 + pgvector)]\n"
            "    end\n"
            "    subgraph Query [Real-Time Retrieval & Generation]\n"
            "        User((User Query)) --> API[FastAPI Async Endpoint]\n"
            "        API --> Auth{JWT & RBAC Check}\n"
            "        Auth --> Cache{Redis Query Cache}\n"
            "        Cache -- Hit --> StreamOut[SSE Token Stream]\n"
            "        Cache -- Miss --> Hybrid[Hybrid Search Engine]\n"
            "        Hybrid -->|HNSW Vector Sim| PG\n"
            "        Hybrid -->|BM25 Lexical tsvector| PG\n"
            "        PG --> RRF[Reciprocal Rank Fusion]\n"
            "        RRF --> LLM[LLM Synthesis with Citation Prompt]\n"
            "        LLM --> StreamOut\n"
            "    end"
        ),
        "architecture_steps": [
            {
                "title": "Document Ingestion & Context-Aware Chunking",
                "description": (
                    "Hierarchical markdown parser segments documents along semantic heading boundaries with dynamic 15% overlap, "
                    "preventing fragment truncation and generating 1536-dimensional embeddings."
                ),
            },
            {
                "title": "Hybrid Vector + Lexical Search",
                "description": (
                    "Executes parallel queries: pgvector cosine distance over HNSW indexes and PostgreSQL tsvector/tsquery "
                    "lexical search, combining candidate scores using Reciprocal Rank Fusion (RRF)."
                ),
            },
            {
                "title": "Security Scope & RBAC Filtering",
                "description": (
                    "Enforces tenant and department security scopes directly in the SQL WHERE clause, mathematically guaranteeing "
                    "unauthorized records never reach the context window."
                ),
            },
            {
                "title": "Grounded LLM Generation & Citation Streaming",
                "description": (
                    "Constructs a grounded system prompt with strict citation constraints and streams synthesized tokens to the client "
                    "via FastAPI Server-Sent Events (SSE)."
                ),
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {"name": "Next.js & React", "purpose": "Interactive query explorer with streaming markdown renderer"},
                {"name": "Tailwind CSS", "purpose": "High-contrast technical dark mode UI with citation badges"},
            ],
            "backend": [
                {"name": "FastAPI", "purpose": "High-concurrency async REST API and Server-Sent Events streaming"},
                {"name": "Python 3.12", "purpose": "Async runtime powering document ingestion and retrieval logic"},
                {"name": "LlamaIndex", "purpose": "Document parsing, node management, and prompt assembly framework"},
            ],
            "database": [
                {"name": "PostgreSQL 17", "purpose": "Primary ACID transactional database and document metadata store"},
                {"name": "pgvector", "purpose": "In-database vector embeddings with HNSW indexing for sub-50ms search"},
                {"name": "Redis", "purpose": "Embedding cache and frequent query synthesis response caching"},
            ],
            "infrastructure": [
                {"name": "Docker & Compose", "purpose": "Reproducible multi-container local and staging environments"},
                {"name": "JWT / OAuth2", "purpose": "Stateless claims-based authentication and department role mapping"},
            ],
            "ai": [
                {"name": "text-embedding-3-small", "purpose": "Dense semantic vector representations (1536 dims)"},
                {"name": "GPT-4o Mini / Claude", "purpose": "Context-grounded synthesis with structured source citation"},
            ],
            "deployment": [
                {"name": "Uvicorn & Gunicorn", "purpose": "ASGI process manager with asynchronous worker loops"},
                {"name": "Linux Container Host", "purpose": "Optimized containerized production workload execution"},
            ],
        },
        "key_features": [
            {
                "title": "Hybrid BM25 + Vector Retrieval",
                "description": "Combines dense semantic understanding with exact lexical matching to eliminate technical acronym blind spots.",
                "status": "Completed",
            },
            {
                "title": "PostgreSQL pgvector HNSW Indexing",
                "description": "Leverages Hierarchical Navigable Small World (HNSW) graphs inside PostgreSQL, avoiding standalone vector cluster overhead.",
                "status": "Completed",
            },
            {
                "title": "Document-Level RBAC Filtering",
                "description": "Enforces authorization at the database query level, preventing data leakage across department access tiers.",
                "status": "Completed",
            },
            {
                "title": "Redis Response & Embedding Caching",
                "description": "Caches identical semantic query vectors and answer tokens to achieve sub-50ms cache hits on common inquiries.",
                "status": "Completed",
            },
            {
                "title": "Automated Confidence & Citation Scoring",
                "description": "Computes similarity distance thresholds and generates verifiable inline document citation footnotes.",
                "status": "Completed",
            },
            {
                "title": "Multi-Format Ingestion Connectors (PDF, Confluence)",
                "description": "Scheduled background workers to ingest binary PDFs, Word docs, and API documentation continuously.",
                "status": "Planned",
            },
        ],
        "engineering_decisions": [
            {
                "title": "PostgreSQL pgvector over Standalone Vector DB",
                "context": "Needed vector search capabilities without introducing cluster synchronization latency or duplicate authorization logic.",
                "decision": "Selected pgvector within PostgreSQL 17 to keep relational SQL data, access roles, and embeddings in one ACID store.",
                "outcome": "Simplified backup and restore procedures, guaranteed transaction consistency, and cut cloud hosting overhead by 60%.",
            },
            {
                "title": "Server-Sent Events (SSE) vs WebSockets for Streaming",
                "context": "Waiting for complete LLM responses caused high perceived latency (3-4 seconds before first text visible).",
                "decision": "Implemented unidirectional SSE over HTTP/2 instead of bi-directional WebSocket connection management.",
                "outcome": "Reduced time-to-first-token to under 250ms with automatic HTTP reconnect handling and lower connection state overhead.",
            },
            {
                "title": "Reciprocal Rank Fusion (RRF) for Search Merging",
                "context": "Raw vector cosine scores and BM25 relevance scores exist on different numerical scales, making naive addition ineffective.",
                "decision": "Applied RRF algorithm with rank constant k=60 to merge ranking lists without score calibration dependencies.",
                "outcome": "Improved top-3 retrieval precision from 81% (vector-only) to 94.2% (hybrid RRF).",
            },
        ],
        "challenges": [
            {
                "title": "Vector Search Hallucinations on Exact Technical Terms",
                "challenge": "Pure vector similarity frequently missed exact error codes (e.g. 'ERR_SOCKET_TIMEOUT_104') because embeddings map semantic concepts rather than literal characters.",
                "solution": "Integrated PostgreSQL full-text search with customized tsvector dictionaries and combined rankings using Reciprocal Rank Fusion.",
                "impact": "Eliminated technical term retrieval failures, ensuring 100% recall on specific system error identifiers.",
            },
            {
                "title": "Multi-Tenant Authorization Leakage Risks",
                "challenge": "Filtering documents post-retrieval in Python application memory often resulted in empty context windows when top candidates were filtered out.",
                "solution": "Pushed user role access arrays directly into the SQL WHERE clause before vector similarity ordering.",
                "impact": "Guaranteed 100% security boundary enforcement while preserving high top-k context density.",
            },
        ],
        "security_reliability": [
            {
                "title": "Granular Access Boundary Enforcement",
                "description": "Row-level security scopes ensure vector search queries only scan documents the requesting user's JWT grants access to.",
                "icon_name": "Shield",
            },
            {
                "title": "Strict Prompt Sandboxing & Injection Mitigation",
                "description": "Retrieved context passages are sanitized and delimited using structured XML tags with explicit instruction-override guardrails.",
                "icon_name": "Lock",
            },
            {
                "title": "Rate Limiting & Token Quotas",
                "description": "Redis token-bucket rate limiters prevent API abuse and control downstream LLM generation expenses per client tenant.",
                "icon_name": "Zap",
            },
        ],
        "results": [
            "Delivered sub-400ms average retrieval latency across enterprise document corpuses exceeding 50,000 pages.",
            "Attained 94.2% top-3 retrieval precision score on domain-specific technical documentation benchmarks.",
            "Zero recorded cross-department authorization bypasses during automated security boundary penetration tests.",
        ],
        "lessons_learned": [
            "Fixed-character chunking destroys tabular and structured code semantics; layout-aware section parsing is essential for high RAG accuracy.",
            "Hybrid search is mandatory for technical domains where users query specific entity identifiers and error strings.",
            "Streaming responses significantly improve user experience even when overall model synthesis takes 2-3 seconds.",
        ],
        "related_slugs": ["autonomous-ai-agent-orchestrator", "christian-digital-content-platform"],
        "sort_order": 0,
    },
    {
        "slug": "christian-digital-content-platform",
        "title": "Christian Digital Content & Streaming Platform",
        "tagline": "Scalable backend API platform powering multi-tenant media distribution",
        "summary": (
            "A high-concurrency content management and streaming API built with FastAPI, PostgreSQL, "
            "and Redis for seamless audio/video catalog delivery and user engagement tracking."
        ),
        "category": "backend-systems",
        "category_label": "Backend & Systems",
        "technologies": [
            "Python 3.12", "FastAPI", "PostgreSQL 17", "SQLAlchemy 2.x",
            "Redis", "Docker", "Alembic", "Pydantic v2", "Cloud Storage CDN",
        ],
        "featured": True,
        "role": "Senior Backend Engineer",
        "timeline": "4 Months",
        "status": "In Production",
        "impact_metrics": [
            "Handles 5,000+ concurrent API requests",
            "Sub-50ms API response time with Redis caching",
            "Zero database deadlocks during peak live streaming events",
        ],
        "github_url": "https://github.com/jossieT",
        "live_url": None,
        "overview": (
            "A cloud-native backend platform designed to distribute digital books, audio teachings, theological articles, "
            "and community media. Built with a clean layered architecture in FastAPI, it features structured media metadata pipelines, "
            "PostgreSQL full-text search indexing, secure HMAC token-based streaming URL generation, and multi-tenant reader bookmarks."
        ),
        "problem": (
            "Content distribution was fragmented across legacy storage servers, causing slow catalog discovery, database lock contention "
            "during peak Sunday broadcast spikes, and unauthenticated hotlinking of media bandwidth."
        ),
        "solution": (
            "Engineered a stateless FastAPI microservice layer with async PostgreSQL connection pooling, hierarchical Redis catalog caching, "
            "and time-limited HMAC signed URL token generators for secure media streaming via CDN edge nodes."
        ),
        "architecture_mermaid": (
            "flowchart TD\n"
            "    subgraph Clients [Client Layer]\n"
            "        App[Mobile Flutter App] --> API[FastAPI Gateway]\n"
            "        Web[Web Reader Portal] --> API\n"
            "    end\n"
            "    subgraph BackendServices [FastAPI Backend Engine]\n"
            "        API --> Auth[JWT Auth & Scope Validation]\n"
            "        API --> Search[Full-Text Search Engine]\n"
            "        API --> Media[HMAC CDN Token Signer]\n"
            "        API --> Library[User Library & Progress Sync]\n"
            "    end\n"
            "    subgraph DataTier [Storage & Caching]\n"
            "        Auth --> Redis[(Redis Cache & Session Store)]\n"
            "        Search --> PG[(PostgreSQL 17 Database)]\n"
            "        Library --> PG\n"
            "        Media --> CDN[Cloud CDN / Object Storage]\n"
            "    end"
        ),
        "architecture_steps": [
            {
                "title": "Stateless FastAPI REST Gateway",
                "description": "Exposes validated OpenAPI endpoints with strict Pydantic v2 data models and asynchronous request handlers.",
            },
            {
                "title": "Async Database Access Layer",
                "description": "SQLAlchemy 2.x async engine with connection pooling to PostgreSQL 17 for transactional reading and library state.",
            },
            {
                "title": "Hierarchical Redis Caching",
                "description": "Multi-tier cache-aside pattern for media catalogs, categories, and author metadata with automated invalidation hooks.",
            },
            {
                "title": "Secure Time-Bounded Media URL Signing",
                "description": "Generates short-lived cryptographic HMAC tokens to authorize client audio/video streaming while preventing unauthorized hotlinking.",
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {"name": "Flutter / Mobile", "purpose": "Cross-platform mobile application for audio streaming and offline reading"},
                {"name": "Next.js Web Portal", "purpose": "Desktop web reader and content discovery catalog"},
            ],
            "backend": [
                {"name": "FastAPI", "purpose": "Stateless REST API delivering sub-50ms catalog responses and signed tokens"},
                {"name": "Python 3.12", "purpose": "Async backend execution engine with non-blocking I/O"},
                {"name": "SQLAlchemy 2.x Async", "purpose": "Modern async ORM with explicit transaction boundary management"},
            ],
            "database": [
                {"name": "PostgreSQL 17", "purpose": "Primary relational database storing content catalogs, bookmarks, and author profiles"},
                {"name": "Redis 7", "purpose": "High-speed caching for hot catalog categories, author lists, and user sessions"},
            ],
            "infrastructure": [
                {"name": "Docker & Compose", "purpose": "Isolated local container environment matching staging configurations"},
                {"name": "Alembic", "purpose": "Version-controlled zero-downtime database schema migration pipelines"},
            ],
            "deployment": [
                {"name": "Cloud Storage CDN", "purpose": "Global edge distribution for audio sermon files, e-books, and article imagery"},
                {"name": "Linux / Nginx", "purpose": "Reverse proxy with TLS termination and gzip/brotli compression"},
            ],
        },
        "key_features": [
            {
                "title": "Digital Book Store & Article Catalog",
                "description": "Categorized repository for e-books, study guides, and theological articles with rich markdown formatting.",
                "status": "Completed",
            },
            {
                "title": "Audio Sermon & Media Streaming",
                "description": "Stream-optimized audio playback with bandwidth protection via time-limited signed URL tokens.",
                "status": "Completed",
            },
            {
                "title": "User Library & Reading Progress Sync",
                "description": "Cross-device progress tracking, saved bookmarks, and favorite collections stored in PostgreSQL.",
                "status": "Completed",
            },
            {
                "title": "Full-Text Search with PostgreSQL GIN Indexes",
                "description": "Fast content search across titles, authors, scripture references, and topics using native tsvector indexing.",
                "status": "Completed",
            },
            {
                "title": "In-App Subscription & Payment Gateways (Telebirr/Stripe)",
                "description": "Planned integration for premium book purchases and supporter subscriptions with localized payment options.",
                "status": "Planned",
            },
            {
                "title": "Author & Publisher Content Submission Portal",
                "description": "Web dashboard allowing verified ministry authors to upload drafts and schedule publishing dates.",
                "status": "Planned",
            },
        ],
        "engineering_decisions": [
            {
                "title": "SQLAlchemy 2.0 Async Session Pattern",
                "context": "Needed high concurrency support without thread pool starvation during simultaneous Sunday streaming traffic spikes.",
                "decision": "Adopted SQLAlchemy 2.x async engine paired with asyncpg for true non-blocking database queries.",
                "outcome": "Increased API throughput capacity by 3.5x under concurrency benchmark testing compared to synchronous WSGI frameworks.",
            },
            {
                "title": "HMAC Token URL Signing over Application Proxying",
                "context": "Streaming large audio/video files directly through the FastAPI application consumed heavy server memory and bandwidth.",
                "decision": "Offloaded actual media delivery to CDN edge nodes using short-lived (15-min) HMAC signature tokens generated by the API.",
                "outcome": "Reduced API server CPU and network load by 85% while securing premium media against unauthorized external hotlinking.",
            },
        ],
        "challenges": [
            {
                "title": "High Traffic Concurrency Spikes during Live Events",
                "challenge": "Simultaneous user logins and catalog lookups during broadcast times threatened to exhaust PostgreSQL connection pools.",
                "solution": "Configured a two-tier Redis cache for top categories, author profiles, and featured media with a 5-minute TTL and background revalidation.",
                "impact": "Absorbed 90% of read traffic at the Redis layer, maintaining sub-45ms p95 latency during peak access windows.",
            },
            {
                "title": "Complex Scripture & Topic Search Relevance",
                "challenge": "Users frequently searched by partial verse citations or topic synonyms requiring accurate relevance ranking.",
                "solution": "Created composite GIN indexes on PostgreSQL tsvector columns combining title, summary, and scripture tag arrays.",
                "impact": "Provided instant search suggestions and sub-20ms multi-field search execution.",
            },
        ],
        "security_reliability": [
            {
                "title": "Cryptographic Media URL Signing",
                "description": "Time-bounded HMAC-SHA256 signatures validate client authorization before media bytes are released by the CDN.",
                "icon_name": "Shield",
            },
            {
                "title": "JWT Token Refresh Rotation",
                "description": "Short-lived access tokens paired with secure httpOnly refresh tokens prevent credential hijacking on public mobile networks.",
                "icon_name": "Key",
            },
            {
                "title": "Atomic Migration Safety",
                "description": "All database schema changes are managed through transactional Alembic scripts tested against staging environments.",
                "icon_name": "Database",
            },
        ],
        "results": [
            "Engineered high-performance REST API architecture capable of sustaining 5,000+ concurrent connections.",
            "Attained average p95 API response times under 45ms across all content catalog endpoints.",
            "Zero database deadlocks or connection starvation incidents recorded during synthetic load testing.",
        ],
        "lessons_learned": [
            "Never stream binary media through API application servers; always delegate byte transport to CDN object stores via signed URLs.",
            "Cache keys must be systematically namespaced (e.g. `catalog:category:{id}:page:{n}`) to make selective cache invalidation deterministic.",
        ],
        "related_slugs": ["intelligent-booking-engine", "enterprise-ai-knowledge-platform"],
        "sort_order": 1,
    },
    {
        "slug": "intelligent-booking-engine",
        "title": "Intelligent Booking & Scheduling Engine",
        "tagline": "Transactional scheduling platform with pessimistic concurrency locks",
        "summary": (
            "A resilient backend scheduling microservice resolving double-booking race conditions "
            "through PostgreSQL pessimistic locking, real-time availability calculation, and automated reminders."
        ),
        "category": "backend-systems",
        "category_label": "Backend Systems",
        "technologies": [
            "Python 3.12", "FastAPI", "PostgreSQL 17", "Redis", "Celery", "Docker", "Pydantic v2", "Postman",
        ],
        "featured": True,
        "role": "Backend Systems Engineer",
        "timeline": "2 Months",
        "status": "Completed",
        "impact_metrics": [
            "100% prevention of double-booking race conditions",
            "99.8% on-time automated notification dispatch",
        ],
        "github_url": "https://github.com/jossieT",
        "live_url": None,
        "overview": (
            "The Intelligent Booking Engine is a backend service engineered to solve high-contention scheduling challenges "
            "for appointment-based businesses. It provides real-time slot availability computations, exception window management, "
            "and atomic reservation checkout that completely eliminates double bookings under concurrent booking spikes."
        ),
        "problem": (
            "When multiple customers attempted to book the same popular consultation or service window simultaneously, traditional "
            "optimistic locking checks failed, resulting in overlapping appointments, customer frustration, and manual rescheduling overhead."
        ),
        "solution": (
            "Built a transactional scheduling engine in FastAPI utilizing PostgreSQL row-level locks (`SELECT ... FOR UPDATE`), "
            "explicit isolation levels, and an asynchronous Celery/Redis task queue for automated reminder dispatch and calendar synchronization."
        ),
        "architecture_mermaid": (
            "flowchart TD\n"
            "    subgraph Client [Client Interface]\n"
            "        User((Customer / Client)) --> Web[Booking Web App]\n"
            "    end\n"
            "    subgraph BookingAPI [FastAPI Booking Engine]\n"
            "        Web --> Validate[Input & Timezone Validation]\n"
            "        Validate --> Lock[PostgreSQL Row-Level Lock: FOR UPDATE]\n"
            "        Lock --> Commit{Is Slot Free?}\n"
            "        Commit -- Yes --> Reserve[Atomic Reservation Commit]\n"
            "        Commit -- No --> Reject[Conflict 409 Error]\n"
            "    end\n"
            "    subgraph AsyncWorkers [Background Task System]\n"
            "        Reserve --> Queue[(Redis Task Queue)]\n"
            "        Queue --> Worker[Celery Asynchronous Worker]\n"
            "        Worker --> Email[Email / SMS Notification Dispatch]\n"
            "        Worker --> CalSync[Calendar Feed Sync]\n"
            "    end"
        ),
        "architecture_steps": [
            {
                "title": "Timezone Normalization & Validation",
                "description": "Converts customer localized booking requests into UTC ISO timestamps and validates against provider operational schedules.",
            },
            {
                "title": "Pessimistic Row-Level Lock Acquisition",
                "description": "Executes a `SELECT ... FOR UPDATE` query on the target resource availability row to serialize concurrent reservation attempts.",
            },
            {
                "title": "Atomic Booking State Transition",
                "description": "Verifies no existing confirmed or holding reservations overlap the target window, updates slot state, and commits the transaction.",
            },
            {
                "title": "Asynchronous Event & Notification Dispatch",
                "description": "Enqueues confirmation emails, SMS reminders, and calendar .ics generation tasks into Redis for background worker processing.",
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {"name": "React / Next.js", "purpose": "Interactive calendar view with dynamic slot availability highlights"},
                {"name": "Date-fns", "purpose": "Client-side localized timezone formatting and calendar grid math"},
            ],
            "backend": [
                {"name": "FastAPI", "purpose": "High-performance async REST API handling reservation transactions"},
                {"name": "Python 3.12", "purpose": "Core business logic implementing schedule rules and exception overlaps"},
                {"name": "Celery", "purpose": "Distributed asynchronous task queue for scheduled notifications and calendar sync"},
            ],
            "database": [
                {"name": "PostgreSQL 17", "purpose": "ACID transactional database utilizing row-level pessimistic locks and exclusion constraints"},
                {"name": "Redis 7", "purpose": "Message broker for Celery task queues and temporary reservation holding locks"},
            ],
            "infrastructure": [
                {"name": "Docker & Compose", "purpose": "Multi-container setup orchestrating API, PostgreSQL, Redis, and Celery workers"},
                {"name": "Postman / Newman", "purpose": "Automated concurrency test suites simulating simultaneous booking requests"},
            ],
        },
        "key_features": [
            {
                "title": "Pessimistic Locking Concurrency Control",
                "description": "Guarantees zero double bookings during concurrent reservation checkouts via atomic database locks.",
                "status": "Completed",
            },
            {
                "title": "Dynamic Availability & Exception Window Math",
                "description": "Calculates available slots in real time factoring in recurring weekly hours, lunch breaks, and holiday blocks.",
                "status": "Completed",
            },
            {
                "title": "UTC Timezone Standardization",
                "description": "Stores all timestamps in UTC with automated client timezone conversion for multi-region scheduling.",
                "status": "Completed",
            },
            {
                "title": "Asynchronous Email & SMS Reminders",
                "description": "Dispatches confirmation receipts and 24-hour advance reminders via background Celery tasks.",
                "status": "Completed",
            },
            {
                "title": "Provider Admin Management Dashboard",
                "description": "Interface for service providers to block custom dates, configure buffer times, and manage staff schedules.",
                "status": "Completed",
            },
            {
                "title": "Automated Payment Integration (Stripe Webhooks)",
                "description": "Planned integration to hold reservations conditionally pending verified payment authorization webhooks.",
                "status": "Planned",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Pessimistic (FOR UPDATE) vs Optimistic Version Locking",
                "context": "High booking contention on popular service slots caused frequent rollback retry loops under optimistic concurrency control.",
                "decision": "Adopted PostgreSQL pessimistic row locks on slot resource records during the final 5-minute reservation checkout window.",
                "outcome": "Completely eliminated double bookings with deterministic, immediate conflict feedback to competing clients.",
            },
            {
                "title": "Decoupled Celery Worker for Notification Handling",
                "context": "Third-party email and SMS gateway network latency (1-3 seconds) slowed down API checkout response times.",
                "decision": "Decoupled notification dispatch into Redis background tasks handled by Celery workers after transaction commit.",
                "outcome": "Reduced client checkout API response times from 2.4 seconds to under 80ms.",
            },
        ],
        "challenges": [
            {
                "title": "Cross-Timezone Daylight Savings Boundary Calculations",
                "challenge": "Recurring appointments shifted unexpectedly when users and providers resided in different daylight savings transition zones.",
                "solution": "Stored recurring appointment master rules as UTC base offsets combined with IANA timezone strings, evaluating actual offsets at generation time.",
                "impact": "Eliminated appointment time shift bugs across international timezone boundaries.",
            },
            {
                "title": "Simultaneous Slot Reservation Race Conditions",
                "challenge": "Automated testing with 50 simultaneous concurrent requests for a single slot caused duplicate records in naive ORM implementations.",
                "solution": "Enforced PostgreSQL table-level exclusion constraints (`EXCLUDE USING gist`) and `SELECT ... FOR UPDATE` isolation.",
                "impact": "100% of concurrent race tests resolved with exactly one confirmed booking and 49 clean conflict responses.",
            },
        ],
        "security_reliability": [
            {
                "title": "Idempotent Booking Checkout Tokens",
                "description": "Client-generated UUID idempotency keys prevent duplicate reservation creation upon accidental double-clicks or network retries.",
                "icon_name": "RefreshCw",
            },
            {
                "title": "Database Exclusion Constraints",
                "description": "PostgreSQL GIST exclusion constraints provide mathematical guarantees against overlapping time ranges at the storage tier.",
                "icon_name": "Database",
            },
            {
                "title": "Strict Schema Boundary Validation",
                "description": "Pydantic v2 schemas reject malformed time intervals, negative durations, and invalid email addresses prior to database execution.",
                "icon_name": "CheckCircle2",
            },
        ],
        "results": [
            "100% prevention of double bookings across rigorous concurrency test simulations with 100+ concurrent requests.",
            "Sub-80ms API checkout response times achieved by offloading notification dispatch to background workers.",
            "99.8% on-time dispatch rate for automated customer reminder emails and calendar invites.",
        ],
        "lessons_learned": [
            "Concurrency control must be enforced at the database transaction layer; relying on application-level checks invariably leads to race conditions.",
            "Always decouple third-party network I/O (email, payment APIs) from transactional database commits.",
        ],
        "related_slugs": ["christian-digital-content-platform", "autonomous-ai-agent-orchestrator"],
        "sort_order": 2,
    },
    {
        "slug": "autonomous-ai-agent-orchestrator",
        "title": "Autonomous AI Agent Workflow Orchestrator",
        "tagline": "Multi-tool agent framework for enterprise API task automation",
        "summary": (
            "An autonomous agent execution platform that parses natural language operational goals "
            "into structured, deterministic multi-step API tool execution plans."
        ),
        "category": "automation",
        "category_label": "AI & Automation",
        "technologies": [
            "Python 3.12", "FastAPI", "LLM Function Calling", "LangChain",
            "PostgreSQL", "Docker", "JSON Schema",
        ],
        "featured": False,
        "role": "AI Platform Engineer",
        "timeline": "2 Months",
        "status": "Active Development",
        "impact_metrics": [
            "88% reduction in manual multi-system lookup tasks",
            "Automated fallback recovery on API timeout",
        ],
        "github_url": "https://github.com/jossieT",
        "live_url": None,
        "overview": (
            "An agentic framework designed to bridge natural language operational requests with strict backend REST APIs. "
            "The orchestrator decomposes complex goals into typed tool invocations, dynamically reflects on execution errors, "
            "and maintains a transparent PostgreSQL audit log of every reasoning node."
        ),
        "problem": (
            "DevOps and operations engineers spent hours manually chaining commands across separate internal systems (user registries, "
            "billing portals, cloud infrastructure telemetry) to diagnose customer issues and execute repetitive maintenance routines."
        ),
        "solution": (
            "Engineered an autonomous agent execution engine in Python/FastAPI using strict JSON schema tool validation, stateful "
            "execution graph tracking, and automatic self-correcting error recovery loops."
        ),
        "architecture_mermaid": (
            "flowchart TD\n"
            "    subgraph UserInput [Goal Definition]\n"
            "        Goal[Natural Language Goal] --> Agent[Orchestrator Agent]\n"
            "    end\n"
            "    subgraph PlanningLoop [Reasoning & Tool Loop]\n"
            "        Agent --> Plan[Structured Plan Decomposition]\n"
            "        Plan --> ToolSelect{Select Tool & Generate Args}\n"
            "        ToolSelect --> Validate[Pydantic JSON Schema Validation]\n"
            "        Validate -- Valid --> Exec[Execute Sandboxed API Tool]\n"
            "        Validate -- Invalid --> Correct[Self-Correction Prompt Loop]\n"
            "        Correct --> ToolSelect\n"
            "        Exec --> Reflect{Evaluate Tool Output}\n"
            "        Reflect -- Next Step Needed --> ToolSelect\n"
            "        Reflect -- Goal Complete --> Final[Synthesize Final Result]\n"
            "    end\n"
            "    subgraph Telemetry [Audit & Safety]\n"
            "        Exec --> Audit[(PostgreSQL Step Audit Log)]\n"
            "        Reflect --> Guard[Iteration Limit & Budget Guardrail]\n"
            "    end"
        ),
        "architecture_steps": [
            {
                "title": "Natural Language Goal Decomposition",
                "description": "LLM parses high-level operational intent and breaks it into an ordered dependency graph of tool execution steps.",
            },
            {
                "title": "Strict Schema Validation & Tool Invocation",
                "description": "Validates generated arguments against Pydantic v2 schemas before dispatching real REST or system commands.",
            },
            {
                "title": "Output Reflection & Error Self-Healing",
                "description": "Inspects returned API responses; if an endpoint errors, the agent feeds the error context back into the LLM to select an alternative strategy.",
            },
            {
                "title": "Step Audit Logging & Final Synthesis",
                "description": "Persists token usage, execution timestamps, tool inputs, and structured outcomes to PostgreSQL for security review.",
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {"name": "React / Next.js", "purpose": "Interactive agent trace explorer showing step-by-step reasoning nodes"},
                {"name": "Framer Motion", "purpose": "Smooth node expansion and animated state transitions during execution"},
            ],
            "backend": [
                {"name": "FastAPI", "purpose": "Async backend hosting tool registry and agent execution runners"},
                {"name": "Python 3.12", "purpose": "Core agent state machine, reflection loops, and tool sandboxing"},
                {"name": "LangChain / Custom Graph", "purpose": "Agent state management and tool execution orchestration"},
            ],
            "database": [
                {"name": "PostgreSQL 17", "purpose": "Persistent storage for agent execution traces, tool logs, and token budgets"},
            ],
            "infrastructure": [
                {"name": "Docker", "purpose": "Sandboxed container execution environment for system tool commands"},
                {"name": "JSON Schema / Pydantic", "purpose": "Strict validation layer ensuring typed model tool parameters"},
            ],
            "ai": [
                {"name": "GPT-4o / Claude 3.5 Sonnet", "purpose": "Function calling and dynamic error reflection reasoning"},
            ],
        },
        "key_features": [
            {
                "title": "Strict JSON Schema Function Calling",
                "description": "Enforces strict type and value constraints on LLM tool arguments prior to any backend execution.",
                "status": "Completed",
            },
            {
                "title": "Dynamic Self-Healing Error Loops",
                "description": "Catches API timeouts or 4xx errors and automatically re-prompts the model with error trace context to pivot strategies.",
                "status": "Completed",
            },
            {
                "title": "Comprehensive Execution Telemetry",
                "description": "Logs token costs, latency, tool arguments, and output snapshots for every step to PostgreSQL.",
                "status": "Completed",
            },
            {
                "title": "Configurable Safety Guardrails",
                "description": "Enforces maximum iteration limits (e.g. max 10 steps) and token budgets to prevent runaway execution loops.",
                "status": "Completed",
            },
            {
                "title": "Human-in-the-Loop Approval for Destructive Tools",
                "description": "Pauses agent execution and requests operator confirmation before executing database modifications or server restarts.",
                "status": "Planned",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Pydantic Schema Validation for Function Calling",
                "context": "Unvalidated LLM tool calling caused runtime TypeErrors when models produced hallucinated parameter names.",
                "decision": "Wrapped every tool in a Pydantic model with pre-execution validation before dispatching actual requests.",
                "outcome": "Achieved 99.4% tool invocation reliability with instant client-side feedback on schema mismatches.",
            },
            {
                "title": "Stateful Step Logging in PostgreSQL",
                "context": "Enterprise operators needed full transparency to verify why an agent took a specific operational decision.",
                "decision": "Designed a relational trace schema storing prompt tokens, raw tool inputs, and output responses per execution step.",
                "outcome": "Provided complete audit compliance and enabled post-incident debugging of agent reasoning trajectories.",
            },
        ],
        "challenges": [
            {
                "title": "Infinite Loop Prevention on Repetitive Failures",
                "challenge": "When an API persistently failed, early agent iterations repeatedly re-tried the exact same failed arguments.",
                "solution": "Introduced a loop detection heuristic that tracks repeated tool signatures and forces the agent to try alternative tools or abort.",
                "impact": "Completely eliminated token budget waste from infinite retry loops.",
            },
            {
                "title": "Sandboxing System-Level Tool Invocations",
                "challenge": "Executing shell and database tools posed security risks if prompts attempted command injection.",
                "solution": "Constrained all tool implementations to parameterized API calls and restricted Docker sandbox boundaries.",
                "impact": "Prevented unauthorized command injection while retaining powerful automation capabilities.",
            },
        ],
        "security_reliability": [
            {
                "title": "Execution Sandbox & Isolation",
                "description": "All tool actions execute within isolated network scopes with read-only database roles by default.",
                "icon_name": "Shield",
            },
            {
                "title": "Iteration & Token Budget Guardrails",
                "description": "Hard iteration caps and per-task token limits terminate execution if a task exceeds its allocated boundary.",
                "icon_name": "Sliders",
            },
            {
                "title": "Immutable Step Audit Trail",
                "description": "Every prompt, reasoning thought, and tool result is logged to PostgreSQL with immutable created_at timestamps.",
                "icon_name": "FileText",
            },
        ],
        "results": [
            "Achieved 88% reduction in manual multi-system lookup time for routine operational troubleshooting workflows.",
            "Attained 99.4% tool invocation reliability through pre-execution Pydantic schema validation.",
            "Provided full audit trace visibility across all multi-step autonomous workflows.",
        ],
        "lessons_learned": [
            "Autonomous agents must always have hard iteration caps and timeout guardrails to prevent infinite loop token waste.",
            "Strict schema validation on LLM tool outputs is the single most effective way to eliminate agent runtime crashes.",
        ],
        "related_slugs": ["enterprise-ai-knowledge-platform", "intelligent-booking-engine"],
        "sort_order": 3,
    },
]

# ---------------------------------------------------------------------------
# Experience data
# ---------------------------------------------------------------------------
EXPERIENCES = [
    {
        "slug": "infrastructure-support-cbe",
        "role": "Infrastructure Support",
        "company": "Commercial Bank of Ethiopia",
        "location": "Addis Ababa, AA",
        "period": "May 2025 — Present",
        "is_current": True,
        "category": "infrastructure",
        "summary": (
            "Configuring, tuning, and maintaining high-availability web server environments, enterprise application deployments, "
            "and mission-critical banking infrastructure operations."
        ),
        "highlights": [
            "Configured and optimized enterprise web servers (Nginx, Apache, IIS) to maximize uptime, streamline throughput, and improve system reliability across banking services.",
            "Deployed and maintained enterprise web applications through standardized, reproducible deployment workflows, minimizing environment drift.",
            "Diagnosed and resolved complex server, network, and configuration incidents, implementing root-cause remedies that prevented recurring issues.",
            "Monitored server health, resource utilization, and infrastructure metrics to ensure stable, secure, and uninterrupted 24/7 banking operations.",
        ],
        "technologies": [
            "Nginx", "Linux", "Web Servers", "Infrastructure", "Monitoring", "CI/CD", "Bash", "System Reliability", "Security",
        ],
        "sort_order": 0,
    },
    {
        "slug": "freelance-backend-developer",
        "role": "Freelance Backend Developer",
        "company": "Self-Employed",
        "location": "Remote",
        "period": "Jan 2024 — Present",
        "is_current": True,
        "category": "backend",
        "summary": (
            "Architecting and delivering tailored backend architectures, high-performance RESTful APIs, database solutions, "
            "and cloud deployments for diverse client business requirements."
        ),
        "highlights": [
            "Designed and developed scalable backend systems and architectures for web-based applications customized to client domain requirements.",
            "Built, documented, and maintained high-throughput RESTful APIs with automated data validation, robust error handling, and optimized endpoints.",
            "Deployed production applications and managed cloud server environments (AWS, Linux, Docker) to guarantee reliability, high availability, and optimal response times.",
            "Collaborated directly with founders and technical stakeholders to analyze requirements, scope architecture, and deliver practical solutions addressing real business challenges.",
            "Integrated third-party APIs, authentication providers, payment services, and relational/NoSQL data stores (PostgreSQL, Redis) to expand application capability.",
        ],
        "technologies": [
            "Python", "FastAPI", "TypeScript", "NestJS", "Node.js", "PostgreSQL", "Redis", "Docker", "REST APIs", "SQLAlchemy", "AWS", "Git",
        ],
        "sort_order": 1,
    },
    {
        "slug": "it-support-sysadmin-cbe",
        "role": "Technical IT Support and System Administrator",
        "company": "Commercial Bank of Ethiopia",
        "location": "Addis Ababa, AA",
        "period": "Dec 2022 — May 2025",
        "is_current": False,
        "category": "infrastructure",
        "summary": (
            "Administered nationwide enterprise IT systems, directory infrastructure, network operations, hardware lifecycle, "
            "and identity access management for 50,000+ users."
        ),
        "highlights": [
            "Administered enterprise Active Directory for 50,000+ banking personnel, managing role-based access control (RBAC), security policies, and seamless cross-department permissions.",
            "Managed enterprise system maintenance schedules, critical OS/software updates, and infrastructure enhancements, boosting overall performance and compliance.",
            "Resolved multi-tiered hardware, operating system, and network software incidents with high efficiency, substantially decreasing mean time to resolution (MTTR).",
            "Enhanced proactive system monitoring, alert triage, and health reporting frameworks, significantly reducing unplanned service outages across branch networks.",
        ],
        "technologies": [
            "Active Directory", "Windows Server", "Linux", "System Administration", "Network Infrastructure", "RBAC", "Hardware Maintenance", "Incident Management",
        ],
        "sort_order": 2,
    },
]

# ---------------------------------------------------------------------------
# Skill categories data
# ---------------------------------------------------------------------------
SKILL_CATEGORIES = [
    {
        "slug": "ai-engineering",
        "title": "AI Engineering & RAG",
        "description": "Production RAG systems, vector embeddings, agent orchestration, and tool integration.",
        "icon_name": "Cpu",
        "sort_order": 0,
        "skills": [
            {"name": "LLM Orchestration", "level": "Expert", "is_core": True, "sort_order": 0},
            {"name": "RAG Architecture", "level": "Expert", "is_core": True, "sort_order": 1},
            {"name": "pgvector & Embeddings", "level": "Expert", "is_core": True, "sort_order": 2},
            {"name": "AI Agents & Tool Calling", "level": "Advanced", "is_core": True, "sort_order": 3},
            {"name": "LlamaIndex & LangChain", "level": "Advanced", "is_core": False, "sort_order": 4},
            {"name": "Hybrid Search (BM25 + Vector)", "level": "Expert", "is_core": True, "sort_order": 5},
            {"name": "Prompt Engineering & Eval", "level": "Advanced", "is_core": False, "sort_order": 6},
        ],
    },
    {
        "slug": "backend-engineering",
        "title": "Backend & Systems",
        "description": "High-performance Python backends, async architectures, and RESTful API engineering.",
        "icon_name": "Server",
        "sort_order": 1,
        "skills": [
            {"name": "Python 3.12", "level": "Expert", "is_core": True, "sort_order": 0},
            {"name": "FastAPI", "level": "Expert", "is_core": True, "sort_order": 1},
            {"name": "Pydantic v2", "level": "Expert", "is_core": True, "sort_order": 2},
            {"name": "SQLAlchemy 2.x (Async)", "level": "Expert", "is_core": True, "sort_order": 3},
            {"name": "REST API Design", "level": "Expert", "is_core": True, "sort_order": 4},
            {"name": "TypeScript & Node.js", "level": "Proficient", "is_core": False, "sort_order": 5},
            {"name": "NestJS", "level": "Proficient", "is_core": False, "sort_order": 6},
        ],
    },
    {
        "slug": "cloud-infrastructure",
        "title": "Cloud & Infrastructure",
        "description": "Containerization, cluster orchestration, CI/CD pipelines, and cloud platform delivery.",
        "icon_name": "Cloud",
        "sort_order": 2,
        "skills": [
            {"name": "Docker & Docker Compose", "level": "Expert", "is_core": True, "sort_order": 0},
            {"name": "Kubernetes", "level": "Advanced", "is_core": True, "sort_order": 1},
            {"name": "OpenShift", "level": "Advanced", "is_core": True, "sort_order": 2},
            {"name": "Linux System Admin", "level": "Expert", "is_core": True, "sort_order": 3},
            {"name": "AWS Cloud Services", "level": "Advanced", "is_core": True, "sort_order": 4},
            {"name": "CI/CD & GitHub Actions", "level": "Advanced", "is_core": False, "sort_order": 5},
            {"name": "Redis Caching", "level": "Expert", "is_core": True, "sort_order": 6},
        ],
    },
    {
        "slug": "data-engineering",
        "title": "Data & Storage",
        "description": "Relational database modeling, vector indexing, migration management, and key-value caching.",
        "icon_name": "Database",
        "sort_order": 3,
        "skills": [
            {"name": "PostgreSQL 17", "level": "Expert", "is_core": True, "sort_order": 0},
            {"name": "Alembic Migrations", "level": "Expert", "is_core": True, "sort_order": 1},
            {"name": "Redis 7", "level": "Expert", "is_core": True, "sort_order": 2},
            {"name": "Vector Databases", "level": "Advanced", "is_core": True, "sort_order": 3},
            {"name": "MySQL", "level": "Proficient", "is_core": False, "sort_order": 4},
            {"name": "MongoDB", "level": "Proficient", "is_core": False, "sort_order": 5},
        ],
    },
    {
        "slug": "frontend-engineering",
        "title": "Frontend & UI",
        "description": "Modern component architectures, type-safe layouts, and sleek responsive design.",
        "icon_name": "Layout",
        "sort_order": 4,
        "skills": [
            {"name": "Next.js (App Router)", "level": "Advanced", "is_core": True, "sort_order": 0},
            {"name": "React 19", "level": "Advanced", "is_core": True, "sort_order": 1},
            {"name": "TypeScript", "level": "Advanced", "is_core": True, "sort_order": 2},
            {"name": "Tailwind CSS", "level": "Advanced", "is_core": True, "sort_order": 3},
            {"name": "Responsive UI/UX", "level": "Advanced", "is_core": False, "sort_order": 4},
        ],
    },
]

# ---------------------------------------------------------------------------
# Services data
# ---------------------------------------------------------------------------
SERVICES = [
    {
        "slug": "ai-rag-knowledge-platforms",
        "title": "AI & RAG Knowledge Platforms",
        "category": "ai-applications",
        "description": (
            "Design and deploy production-grade RAG systems that query complex document corpuses "
            "with precision, citations, and role-based access control."
        ),
        "deliverables": [
            "Custom vector embedding pipelines (pgvector)",
            "Hybrid search (BM25 lexical + vector semantic ranking)",
            "Document security & permission filtering at database level",
            "Streaming SSE response endpoints with inline citations",
            "Evaluation benchmarks for retrieval precision & hallucination guardrails",
        ],
        "technologies": ["Python", "FastAPI", "PostgreSQL", "pgvector", "Redis", "LlamaIndex", "Docker"],
        "icon_name": "BrainCircuit",
        "sort_order": 0,
    },
    {
        "slug": "ai-agent-workflow-automation",
        "title": "AI Agent & Workflow Automation",
        "category": "ai-automation",
        "description": (
            "Build autonomous AI agent workflows that interact with your internal APIs, databases, "
            "and third-party tools to automate complex multi-step processes."
        ),
        "deliverables": [
            "Structured function calling & JSON schema validation",
            "Multi-step agent state machines with self-healing retry logic",
            "Secure API tool sandboxing and parameter sanitization",
            "Step-by-step audit logging and cost tracking dashboards",
        ],
        "technologies": ["Python", "FastAPI", "JSON Schema", "LangChain", "Redis", "PostgreSQL"],
        "icon_name": "Bot",
        "sort_order": 1,
    },
    {
        "slug": "high-performance-backend-engineering",
        "title": "High-Performance Backend Engineering",
        "category": "backend-systems",
        "description": (
            "Architect clean, robust, and asynchronous RESTful backend microservices capable of "
            "handling high concurrency with sub-50ms query latencies."
        ),
        "deliverables": [
            "FastAPI microservices with strict Pydantic v2 validation",
            "SQLAlchemy 2.x async ORM and PostgreSQL schema design",
            "Redis multi-level caching strategies and rate limiting",
            "JWT authentication, RBAC, and granular API rate control",
            "Automated Alembic database migration setups",
        ],
        "technologies": ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Redis", "Pydantic", "Docker"],
        "icon_name": "Server",
        "sort_order": 2,
    },
    {
        "slug": "cloud-native-infrastructure-platforms",
        "title": "Cloud-Native Infrastructure & Platforms",
        "category": "cloud-native",
        "description": (
            "Containerize and orchestrate your backend microservices for seamless production deployment "
            "across Docker, Kubernetes, OpenShift, and AWS."
        ),
        "deliverables": [
            "Multi-stage optimized Docker containerization",
            "Kubernetes & OpenShift deployment manifests",
            "Automated GitHub Actions CI/CD build & test pipelines",
            "Production health check, liveness, and readiness probes",
            "Environment isolation & configuration security",
        ],
        "technologies": ["Docker", "Kubernetes", "OpenShift", "Linux", "AWS", "GitHub Actions"],
        "icon_name": "CloudContainer",
        "sort_order": 3,
    },
]

# ---------------------------------------------------------------------------
# Articles data
# ---------------------------------------------------------------------------
ARTICLES = [
    {
        "slug": "building-production-rag-systems-with-fastapi-and-pgvector",
        "title": "Building Production-Ready RAG Systems with FastAPI and pgvector",
        "excerpt": (
            "A deep technical breakdown of building enterprise RAG platforms without standalone vector "
            "databases, featuring hybrid BM25 + vector search and database-level security filters."
        ),
        "published_at": "2026-02-10",
        "read_time": "8 min read",
        "category": "AI Engineering",
        "tags": ["RAG", "FastAPI", "PostgreSQL", "pgvector", "Python"],
        "featured": True,
        "content": """# Building Production-Ready RAG Systems with FastAPI and pgvector

Retrieval-Augmented Generation (RAG) has matured from simple vector search prototypes into mission-critical enterprise knowledge platforms. However, moving RAG from a Jupyter notebook to production introduces significant engineering challenges around security, latency, and operational complexity.

In this article, we examine how to architect a production RAG system using **FastAPI**, **PostgreSQL with pgvector**, and **Redis**, eliminating the need for separate standalone vector database clusters.

---

## 1. Why PostgreSQL pgvector for Production RAG?

While standalone vector databases (such as Pinecone, Qdrant, or Milvus) offer specialized vector features, they introduce system boundaries that complicate enterprise architectures:

- **Dual-System Synchronization**: Keeping relational metadata in sync with external vector indexes requires complex distributed transactions.
- **ACID Compliance**: Updating document permissions in PostgreSQL instantly reflects in vector queries.
- **Cost & Operations**: Managing PostgreSQL clusters is a solved problem. Adding `pgvector` introduces HNSW indexing directly inside existing PostgreSQL pipelines.

---

## 2. Hybrid Search Architecture: BM25 + Vector Similarity

Dense vector embeddings capture semantic intent, but frequently fail when users query precise alphanumerics. To achieve enterprise precision, implement **Hybrid Search** using Reciprocal Rank Fusion (RRF).

---

## 3. Grounded Streaming via FastAPI and SSE

Waiting for an LLM to generate a complete answer introduces latency of 3–6 seconds. Using Server-Sent Events (SSE) in FastAPI streams tokens to the client asynchronously:

- **Instant First Token**: Users see initial responses in under 250ms.
- **Inline Citations**: Metadata fragments are attached to chunk payload headers.

---

## 4. Key Takeaways

1. **Keep Vectors in PostgreSQL**: Unless your dataset exceeds tens of millions of active vectors, `pgvector` with HNSW indexing delivers sub-50ms query performance with native SQL RBAC.
2. **Hybrid Search is Essential**: Always pair dense vector embeddings with lexical keyword matching.
3. **Stream Responses**: Use FastAPI SSE for token streaming to maximize perceived UI responsiveness.
""",
    },
    {
        "slug": "fastapi-architecture-patterns-for-scalable-microservices",
        "title": "FastAPI Architecture Patterns for High-Concurrency Microservices",
        "excerpt": (
            "A comprehensive guide to structuring FastAPI projects for production readiness, covering "
            "async SQLAlchemy 2.0, dependency injection, and Pydantic v2 validation."
        ),
        "published_at": "2026-01-22",
        "read_time": "6 min read",
        "category": "Backend Systems",
        "tags": ["FastAPI", "Python", "SQLAlchemy", "Async", "Architecture"],
        "featured": False,
        "content": """# FastAPI Architecture Patterns for High-Concurrency Microservices

FastAPI has become the standard framework for modern Python backends due to its native `async/await` support, automatic OpenAPI generation, and speed. However, unorganized FastAPI projects often degrade into monolithic file structures with leaking database sessions.

---

## 1. Clean Layered Architecture

Structure your application codebase into strict responsibility layers:

- **`api/`**: Route definitions, HTTP request parsing, and status codes.
- **`schemas/`**: Pydantic v2 models for request validation and response serialization.
- **`services/`**: Domain business logic isolated from HTTP dependencies.
- **`db/`**: Database session management, ORM models, and repository interfaces.

---

## 2. Asynchronous Database Sessions with SQLAlchemy 2.x

Never block FastAPI's async event loop with synchronous database drivers. Always use `asyncpg` and SQLAlchemy's `AsyncSession`.

---

## 3. Summary & Best Practices

- Validate every input schema with Pydantic v2.
- Isolate business logic inside service classes rather than route handlers.
- Use Redis for cache-aside patterns to protect primary PostgreSQL database pools.
""",
    },
    {
        "slug": "containerizing-and-deploying-backend-platforms-on-kubernetes-and-openshift",
        "title": "Deploying Backend Platforms on Kubernetes and OpenShift",
        "excerpt": (
            "Best practices for containerizing Python backend applications, managing configuration secrets, "
            "and setting up health probes for resilient cloud deployment."
        ),
        "published_at": "2025-12-15",
        "read_time": "7 min read",
        "category": "Cloud-Native",
        "tags": ["Kubernetes", "OpenShift", "Docker", "DevOps", "Cloud"],
        "featured": False,
        "content": """# Deploying Backend Platforms on Kubernetes and OpenShift

Deploying microservices to container platforms like Kubernetes or Red Hat OpenShift requires careful attention to container build steps, health probe endpoints, and non-root execution rules.

---

## 1. Multi-Stage Docker Builds

Keep deployment image sizes minimal and secure by separating build toolchains from execution runtimes.

---

## 2. Health & Readiness Probes

Configuring proper `livenessProbe` and `readinessProbe` manifests ensures Kubernetes zero-downtime rolling updates:

- **Liveness Probe (`/health`)**: Checks if the container process is responsive.
- **Readiness Probe (`/api/v1/health/ready`)**: Checks if downstream dependencies (PostgreSQL, Redis) are healthy before routing traffic.
""",
    },
]


# ---------------------------------------------------------------------------
# Seed helpers
# ---------------------------------------------------------------------------

def seed_projects(session) -> None:
    print("Seeding projects...")
    for data in PROJECTS:
        stmt = (
            pg_insert(Project)
            .values(**data)
            .on_conflict_do_update(
                index_elements=["slug"],
                set_={k: v for k, v in data.items() if k != "slug"},
            )
        )
        session.execute(stmt)
    print(f"  ✓ {len(PROJECTS)} projects upserted")


def seed_experience(session) -> None:
    print("Seeding experience...")
    current_slugs = [d["slug"] for d in EXPERIENCES]
    session.query(Experience).filter(~Experience.slug.in_(current_slugs)).delete(synchronize_session=False)
    for data in EXPERIENCES:
        stmt = (
            pg_insert(Experience)
            .values(**data)
            .on_conflict_do_update(
                index_elements=["slug"],
                set_={k: v for k, v in data.items() if k != "slug"},
            )
        )
        session.execute(stmt)
    print(f"  ✓ {len(EXPERIENCES)} experience entries upserted")


def seed_skills(session) -> None:
    print("Seeding skill categories and skills...")
    for cat_data in SKILL_CATEGORIES:
        cat_data = dict(cat_data)  # avoid mutating the module-level list
        skills = cat_data.pop("skills")
        stmt = (
            pg_insert(SkillCategory)
            .values(**cat_data)
            .on_conflict_do_update(
                index_elements=["slug"],
                set_={k: v for k, v in cat_data.items() if k != "slug"},
            )
            .returning(SkillCategory.id)
        )
        result = session.execute(stmt)
        category_id = result.scalar_one()

        session.execute(
            Skill.__table__.delete().where(Skill.category_id == category_id)
        )
        session.execute(Skill.__table__.insert(), [{"category_id": category_id, **{k: v for k, v in s.items() if k != "category_id"}} for s in skills])
    print(f"  OK: {len(SKILL_CATEGORIES)} skill categories upserted")


def seed_services(session) -> None:
    print("Seeding services...")
    for data in SERVICES:
        stmt = (
            pg_insert(Service)
            .values(**data)
            .on_conflict_do_update(
                index_elements=["slug"],
                set_={k: v for k, v in data.items() if k != "slug"},
            )
        )
        session.execute(stmt)
    print(f"  ✓ {len(SERVICES)} services upserted")


def seed_articles(session) -> None:
    print("Seeding articles...")
    for data in ARTICLES:
        stmt = (
            pg_insert(Article)
            .values(**data)
            .on_conflict_do_update(
                index_elements=["slug"],
                set_={k: v for k, v in data.items() if k != "slug"},
            )
        )
        session.execute(stmt)
    print(f"  ✓ {len(ARTICLES)} articles upserted")


def main() -> None:
    print(f"Connecting to: {settings.database_url[:40]}...")
    with SessionLocal() as session:
        try:
            seed_projects(session)
            seed_experience(session)
            seed_skills(session)
            seed_services(session)
            seed_articles(session)
            session.commit()
            print("\n✅ Database seeded successfully!")
        except Exception as e:
            session.rollback()
            print(f"\n❌ Seed failed: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()

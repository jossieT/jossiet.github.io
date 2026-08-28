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
        "slug": "swift-addis-car-detailing-platform",
        "title": "Swift Addis Car Detailing Platform",
        "tagline": "Production booking and business operations platform for a car detailing service",
        "summary": "A production car detailing platform for appointment booking, service management, staff scheduling, availability, and business operations, backed by a Node.js/Express API and a React administrative dashboard.",
        "category": "backend-systems",
        "category_label": "Backend & Admin System",
        "technologies": [
            "Node.js",
            "Express.js",
            "MongoDB",
            "Mongoose",
            "Cloudinary",
            "Joi",
            "React",
            "JWT Authentication",
        ],
        "featured": True,  # To make it the first project as requested
        "role": "Lead Backend Engineer / Full-Stack Engineer",
        "timeline": "6 months (Initial Build) + Ongoing Maintenance",
        "status": "In Production",
        "impact_metrics": [
            "Production booking workflow with real-time availability management",
            "Centralized platform for comprehensive business operations",
        ],
        "github_url": "https://github.com/jossieT/AutoDetailingAPI",
        "live_url": "https://www.swiftaddisdetailing.com/",
        "overview": "The Swift Addis Car Detailing Platform is a robust, production-grade system designed to streamline and automate the core operations of a car detailing business. Beyond simple appointment scheduling, it functions as a comprehensive business management tool, coordinating customer interactions, service delivery, staff logistics, media documentation, and administrative oversight. The platform ensures seamless operation from customer booking to service completion, supporting real-time availability and efficient resource allocation.",
        "problem": "A car detailing business needs more than a simple appointment form. Manually managing customer bookings, vehicle information, service packages, add-ons, pricing, staff schedules, staff availability, days off, time-slot availability, booking status, and operational management is complex and prone to errors. Without a centralized system, coordinating staff, avoiding overbooking, tracking vehicle image documentation, and handling booking state transitions become significant bottlenecks, hindering growth and service quality. The business required a platform that acted as a business operations hub, not merely a booking API.",
        "solution": "Developed a full-stack platform comprising a Node.js/Express backend API and a dedicated React administrative dashboard. The API orchestrates complex business logic including a dynamic booking engine with real-time availability checks, staff scheduling, media management via Cloudinary, and robust security. The admin dashboard provides a comprehensive interface for managing all aspects of the business, ensuring operational control and data visibility. This integrated system automates scheduling, pricing, and operational workflows, transforming a manual process into an efficient, scalable digital operation.",
        "architecture_diagram": None,
        "architecture_mermaid": """
graph TD
    A[Customer/Admin User] -->|React Frontend / Admin Dashboard| B(REST API)
    B --> C{Load Balancer / Gateway}
    C --> D(Node.js / Express.js)
    D --> E[Joi Validation]
    D --> F[JWT Auth / Rate Limiting]
    D --> G(Controllers / Services)
    G --> H[MongoDB / Mongoose]
    G --> I[Cloudinary (Media Storage)]
    D --> J[Winston Logging]

    subgraph Data Flow
        H -- Document Storage --> I
    end
    """,
        "architecture_steps": [
            {
                "title": "Customer / Admin Interaction",
                "description": "Users interact with the platform through a React-based frontend or a dedicated Admin Dashboard, initiating requests to the backend REST API.",
            },
            {
                "title": "API Gateway & Load Balancing",
                "description": "Requests are routed through a load balancer/API Gateway to the Node.js/Express backend, ensuring scalability and distribution.",
            },
            {
                "title": "Backend API (Node.js / Express.js)",
                "description": "The core application logic, built with Node.js and Express.js, processes all incoming requests.",
            },
            {
                "title": "Request Validation & Security",
                "description": "All incoming data undergoes rigorous validation with Joi, coupled with JWT authentication and rate limiting to secure API endpoints.",
            },
            {
                "title": "Controllers & Services",
                "description": "Modularized controllers handle routing and delegate business logic to services for data manipulation and complex operations.",
            },
            {
                "title": "Data Persistence (MongoDB / Mongoose)",
                "description": "MongoDB, managed via Mongoose ORM, serves as the primary database for storing all operational data, including bookings, users, services, and staff information.",
            },
            {
                "title": "Media Management (Cloudinary)",
                "description": "Integrated with Cloudinary for secure storage, optimization, and delivery of vehicle image documentation associated with bookings.",
            },
            {
                "title": "Logging & Monitoring (Winston)",
                "description": "Winston is implemented for comprehensive application logging, enabling effective monitoring, debugging, and operational insights.",
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {
                    "name": "React",
                    "purpose": "JavaScript library for building user interfaces for the Admin Dashboard.",
                }
            ],
            "backend": [
                {"name": "Node.js", "purpose": "Server-side JavaScript runtime."},
                {"name": "Express.js", "purpose": "Web application framework for Node.js."},
                {"name": "JavaScript", "purpose": "Primary language for backend development."},
            ],
            "database": [
                {
                    "name": "MongoDB",
                    "purpose": "NoSQL document database for flexible data storage.",
                },
                {
                    "name": "MongoDB Atlas",
                    "purpose": "Cloud-hosted MongoDB service for scalability and reliability.",
                },
                {"name": "Mongoose", "purpose": "MongoDB object data modeling (ODM) for Node.js."},
            ],
            "validation": [
                {"name": "Joi", "purpose": "Schema description language and data validator."}
            ],
            "security": [
                {
                    "name": "JWT Authentication",
                    "purpose": "Token-based authentication for securing API endpoints.",
                },
                {
                    "name": "Rate Limiting",
                    "purpose": "Protects API from abuse and ensures fair usage.",
                },
                {
                    "name": "Security Headers",
                    "purpose": "Enhances application security against common web vulnerabilities.",
                },
            ],
            "media": [
                {
                    "name": "Cloudinary",
                    "purpose": "Cloud-based image and video management for vehicle documentation.",
                }
            ],
            "logging": [
                {
                    "name": "Winston",
                    "purpose": "Versatile logging library for structured application logs.",
                }
            ],
            "admin": [
                {
                    "name": "React",
                    "purpose": "Frontend framework for the administrative dashboard UI.",
                },
                {
                    "name": "Node.js/Express.js",
                    "purpose": "Backend API powers the admin dashboard's data interactions.",
                },
            ],
            "infrastructure": [],  # Not enough info to detail specific infra
            "deployment": [],  # Not enough info to detail specific deployment
        },
        "key_features": [
            {
                "title": "Dynamic Booking & Real-time Availability",
                "description": "Customers can select services, packages, and available time slots with immediate feedback on staff and resource availability.",
                "status": "Completed",
            },
            {
                "title": "Staff Scheduling & Management",
                "description": "Comprehensive tools for staff registration, defining working hours, managing shifts, and processing day-off requests, directly impacting booking availability.",
                "status": "Completed",
            },
            {
                "title": "React Administrative Dashboard",
                "description": "A dedicated React-based web interface for administrators to manage bookings, services, staff, pricing, configurations, and review operational metrics.",
                "status": "Completed",
            },
            {
                "title": "Vehicle Media Documentation",
                "description": "Integration with Cloudinary enables secure upload, storage, and association of vehicle images with specific booking records, crucial for quality control and dispute resolution.",
                "status": "Completed",
            },
            {
                "title": "Flexible Service & Pricing Configuration",
                "description": "Admins can define multiple service packages, add-ons, and dynamic pricing rules to accommodate various customer needs.",
                "status": "Completed",
            },
            {
                "title": "Centralized Operational Management",
                "description": "Provides a single source of truth for all business operations, including booking status tracking, customer details, and service histories.",
                "status": "Completed",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Backend Framework Selection (Node.js/Express.js)",
                "context": "Rapid development cycle, need for high I/O operations (booking, data retrieval), and existing team familiarity.",
                "decision": "Chose Node.js with Express.js for its non-blocking I/O model, extensive ecosystem, and ability to build scalable RESTful APIs efficiently.",
                "outcome": "Enabled quick iteration on features and robust handling of concurrent requests related to booking and availability checks.",
            },
            {
                "title": "Database Choice (MongoDB)",
                "context": "Flexible schema for evolving service offerings, customer data, and booking details. Need for fast read/write operations.",
                "decision": "Opted for MongoDB (NoSQL) with Mongoose for its document-oriented model, allowing agile schema changes and efficient handling of diverse data structures.",
                "outcome": "Facilitated rapid prototyping and adaptation to changing business requirements without complex database migrations, while maintaining performance.",
            },
            {
                "title": "Media Storage (Cloudinary)",
                "context": "Requirement to store and serve vehicle image documentation securely and efficiently, with potential for image manipulation/optimization.",
                "decision": "Integrated Cloudinary for cloud-based media management, offloading storage, optimization, and delivery concerns from the primary application server.",
                "outcome": "Ensured high availability and fast delivery of media, improved application performance, and provided built-in image processing capabilities for future use.",
            },
        ],
        "challenges": [
            {
                "title": "Real-time Appointment Availability & Concurrency",
                "challenge": "Ensuring accurate, real-time availability for booking slots, considering staff schedules, existing bookings, service durations, and preventing overbooking.",
                "solution": "Implemented a sophisticated availability engine that calculates available slots dynamically based on staff availability, service duration, and existing appointments. Utilized robust validation to manage concurrency during booking.",
                "impact": "Eliminated double-bookings, provided a reliable customer experience, and optimized staff utilization without manual oversight.",
            },
            {
                "title": "Complex Staff Scheduling & Day-Off Management",
                "challenge": "Coordinating multiple staff members' working hours, shifts, and individual day-off requests, and integrating these constraints into the central booking availability.",
                "solution": "Developed a dedicated staff management module within the API and Admin Dashboard allowing for granular control over staff schedules, approval of day-off requests, and real-time updates to the availability engine.",
                "impact": "Automated complex scheduling, reduced administrative overhead, and ensured booking availability accurately reflected actual staff capacity.",
            },
            {
                "title": "Comprehensive Administrative Dashboard Development",
                "challenge": "Building a user-friendly and feature-rich administrative interface from scratch that provides full control over all aspects of the business platform.",
                "solution": "Designed and developed an intuitive React-based web admin dashboard tightly integrated with the backend API. This dashboard exposes functionalities for managing bookings, services, staff, pricing, and viewing operational analytics.",
                "impact": "Provided business owners with full visibility and control over their operations, reducing reliance on manual processes and external tools.",
            },
        ],
        "security_reliability": [
            {
                "title": "Joi Request Validation",
                "description": "Ensures all incoming API requests conform to expected data schemas, preventing malformed data and common injection attacks.",
                "icon_name": "CheckCircle2",
            },
            {
                "title": "Centralized Error Handling",
                "description": "Implemented global error handling middleware to catch and manage exceptions consistently, providing meaningful error responses without exposing sensitive internal details.",
                "icon_name": "AlertTriangle",
            },
            {
                "title": "Rate Limiting",
                "description": "Protects API endpoints from brute-force attacks and excessive requests, ensuring service availability and fair usage for all clients.",
                "icon_name": "Shield",
            },
            {
                "title": "Security Headers",
                "description": "Configured HTTP security headers (e.g., CORS, X-Content-Type-Options) to mitigate common web vulnerabilities and enhance client-side security.",
                "icon_name": "Lock",
            },
            {
                "title": "JWT Authentication",
                "description": "Secured sensitive API routes with JSON Web Token (JWT) based authentication for both customer and admin users, ensuring authenticated access control.",
                "icon_name": "Key",
            },
            {
                "title": "MongoDB Indexing",
                "description": "Implemented appropriate MongoDB indexes on frequently queried fields (e.g., booking dates, user IDs, service types) to optimize database query performance and scalability.",
                "icon_name": "Database",
            },
        ],
        "results": [
            "Production-grade booking platform actively serving customers and managing detailing operations.",
            "Automated real-time availability management for complex scheduling scenarios.",
            "Centralized staff scheduling and day-off request handling, reducing administrative overhead.",
            "Comprehensive React administrative dashboard providing full operational control and business oversight.",
            "Secure API endpoints with robust validation, authentication, and rate limiting.",
            "Scalable cloud-based vehicle image documentation storage and management via Cloudinary.",
        ],
        "lessons_learned": [
            "Building real-world booking systems demands sophisticated domain-specific scheduling logic (e.g., time-slot calculation, concurrency) that extends far beyond simple CRUD operations.",
            "Effective availability management in a service business must account for diverse operational constraints, including staff availability, service durations, and dynamic resource allocation.",
            "A well-designed administrative dashboard, particularly one built with a modern frontend framework like React, is an essential component for any real-world business platform, providing critical control and visibility for operations.",
            "Production systems inherently require a strong foundation in security (validation, authentication, rate limiting), reliability (error handling, logging), and maintainability from the outset.",
        ],
        "sort_order": 0,  # To make it the first project
    },
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
            "Python 3.12",
            "FastAPI",
            "PostgreSQL 17",
            "pgvector",
            "Redis",
            "Docker",
            "LlamaIndex",
            "OpenAI API",
            "Tailwind CSS",
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
                {
                    "name": "Next.js & React",
                    "purpose": "Interactive query explorer with streaming markdown renderer",
                },
                {
                    "name": "Tailwind CSS",
                    "purpose": "High-contrast technical dark mode UI with citation badges",
                },
            ],
            "backend": [
                {
                    "name": "FastAPI",
                    "purpose": "High-concurrency async REST API and Server-Sent Events streaming",
                },
                {
                    "name": "Python 3.12",
                    "purpose": "Async runtime powering document ingestion and retrieval logic",
                },
                {
                    "name": "LlamaIndex",
                    "purpose": "Document parsing, node management, and prompt assembly framework",
                },
            ],
            "database": [
                {
                    "name": "PostgreSQL 17",
                    "purpose": "Primary ACID transactional database and document metadata store",
                },
                {
                    "name": "pgvector",
                    "purpose": "In-database vector embeddings with HNSW indexing for sub-50ms search",
                },
                {
                    "name": "Redis",
                    "purpose": "Embedding cache and frequent query synthesis response caching",
                },
            ],
            "infrastructure": [
                {
                    "name": "Docker & Compose",
                    "purpose": "Reproducible multi-container local and staging environments",
                },
                {
                    "name": "JWT / OAuth2",
                    "purpose": "Stateless claims-based authentication and department role mapping",
                },
            ],
            "ai": [
                {
                    "name": "text-embedding-3-small",
                    "purpose": "Dense semantic vector representations (1536 dims)",
                },
                {
                    "name": "GPT-4o Mini / Claude",
                    "purpose": "Context-grounded synthesis with structured source citation",
                },
            ],
            "deployment": [
                {
                    "name": "Uvicorn & Gunicorn",
                    "purpose": "ASGI process manager with asynchronous worker loops",
                },
                {
                    "name": "Linux Container Host",
                    "purpose": "Optimized containerized production workload execution",
                },
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
        "sort_order": 3,
    },
    {
        "slug": "rag-complaint-chatbot",
        "title": "RAG Complaint Chatbot",
        "tagline": "Evidence-grounded AI analysis of 1.37 million consumer complaints",
        "summary": "An AI-powered RAG application that enables analysts to query a large-scale CFPB consumer complaint dataset using semantic retrieval and grounded language generation.",
        "category": "ai-engineering",
        "category_label": "AI & RAG Engineering",
        "technologies": [
            "Python",
            "RAG",
            "Sentence Transformers",
            "FAISS",
            "FLAN-T5",
            "Gradio",
        ],
        "featured": False,  # Assuming not featured unless explicitly stated to be visible on homepage
        "role": "AI/ML Engineer",
        "timeline": "Completed Research Project",
        "status": "Completed",  # Using "Completed" as per instructions, as "Research Project" is not a direct status type in schema
        "impact_metrics": [
            "1.37 million consumer complaints indexed and processed",
            "100% retrieval rate on the documented benchmark, with the top-5 relevant chunks found for all benchmark queries.",
            "Analysis reduced from hours of manual review to seconds of automated retrieval.",
        ],
        "github_url": "https://github.com/jossieT/rag-complaint-chatbot",
        "live_url": None,  # Not provided or verified
        "overview": "The RAG Complaint Chatbot is an AI/ML engineering project focused on developing an evidence-grounded system for analyzing large volumes of consumer complaints from the CFPB database. This project demonstrates the full lifecycle of a Retrieval-Augmented Generation (RAG) pipeline, from data preparation and semantic indexing to efficient retrieval and grounded language generation. It aims to empower analysts to quickly extract insights and evidence from unstructured complaint narratives.",
        "problem": "The Consumer Financial Protection Bureau (CFPB) receives an immense volume of consumer complaints about financial products and services. Manually sifting through this dataset, which includes 1.37 million records, to find relevant information is extremely challenging due to its sheer scale, the unstructured nature of complaint narratives, and the diverse range of financial issues covered. Traditional keyword search often falls short, missing semantically related complaints and leading to slow, inefficient manual investigations.",
        "solution": "Developed a comprehensive RAG pipeline to automate and enhance the analysis of CFPB consumer complaints. The solution involves cleaning and chunking complaint narratives, converting them into 384-dimensional embeddings using Sentence Transformers, and storing these efficiently in a FAISS vector index. Analyst queries are semantically matched against this index to retrieve the most relevant complaint excerpts, which are then used to ground the answers generated by a FLAN-T5 language model. A Gradio interface provides an interactive way to query the system and view both the generated answers and their supporting evidence.",
        "architecture_diagram": None,
        "architecture_mermaid": """
flowchart TD
    Data[CFPB Complaint Dataset]
    Clean[Preprocessing & Filtering]
    Chunk[Text Chunking]
    Embed[Sentence Transformer Embeddings]
    FAISS[(FAISS Vector Store)]
    Query[Analyst Query]
    Retrieve[Semantic Retrieval]
    Context[Relevant Complaint Evidence]
    LLM[FLAN-T5 Generation]
    Answer[Grounded Answer]
    UI[Gradio Interface]

    Data --> Clean
    Clean --> Chunk
    Chunk --> Embed
    Embed --> FAISS
    UI --> Query
    Query --> Retrieve
    Retrieve --> FAISS
    FAISS --> Context
    Context --> LLM
    Query --> LLM
    LLM --> Answer
    Answer --> UI
    """,
        "architecture_steps": [
            {
                "title": "Data Preparation",
                "description": "The CFPB consumer complaint dataset undergoes rigorous cleaning and filtering to extract useful complaint narratives, removing noise and standardizing formats for subsequent processing.",
            },
            {
                "title": "Semantic Representation",
                "description": "Each cleaned complaint text chunk is transformed into a 384-dimensional numerical vector (embedding) using the `sentence-transformers/all-MiniLM-L6-v2` model, capturing its semantic meaning.",
            },
            {
                "title": "Vector Indexing",
                "description": "The generated embeddings are efficiently stored and indexed using FAISS (Facebook AI Similarity Search), enabling rapid similarity queries across the large dataset.",
            },
            {
                "title": "Retrieval",
                "description": "When an analyst poses a question, it is first converted into an embedding. This query embedding is then matched against the FAISS index to semantically retrieve the most relevant complaint excerpts (evidence).",
            },
            {
                "title": "Grounded Generation",
                "description": "The retrieved complaint evidence is fed into a `google/flan-t5-small` language model. This model generates a concise answer that is 'grounded' or supported by the provided evidence, reducing hallucinations.",
            },
            {
                "title": "Evidence-Based Interface",
                "description": "A Gradio-based user interface presents the generated answer to the analyst along with the exact raw complaint excerpts that were used as evidence, ensuring transparency and trustworthiness.",
            },
        ],
        "tech_stack_grouped": {
            "data_processing": [
                {
                    "name": "Python",
                    "purpose": "Primary programming language for the entire RAG pipeline.",
                },
                {
                    "name": "Pandas",
                    "purpose": "Data manipulation and analysis for preprocessing the CFPB dataset.",
                },  # Verified in instructions
                {
                    "name": "NumPy",
                    "purpose": "Numerical computing for handling data arrays and embeddings.",
                },  # Verified in instructions
            ],
            "embeddings": [
                {
                    "name": "sentence-transformers/all-MiniLM-L6-v2",
                    "purpose": "Converts text into 384-dimensional dense vector embeddings.",
                }
            ],
            "retrieval": [
                {
                    "name": "FAISS",
                    "purpose": "Efficient library for similarity search and clustering of dense vectors.",
                }
            ],
            "generation": [
                {
                    "name": "google/flan-t5-small",
                    "purpose": "Transformer-based language model for generating grounded answers.",
                }
            ],
            "application": [
                {
                    "name": "Gradio",
                    "purpose": "Python library for creating customizable UI components for ML models.",
                }
            ],
            "evaluation": [
                {
                    "name": "Custom Evaluation Scripts",
                    "purpose": "Python scripts for benchmarking retrieval performance.",
                },
                {
                    "name": "Documented Benchmark",
                    "purpose": "Specific business questions used for evaluating the RAG system.",
                },
            ],
        },
        "key_features": [
            {
                "title": "Large-Scale Complaint Indexing",
                "description": "Processed and indexed 1.37 million CFPB consumer complaints, making them semantically searchable.",
                "status": "Completed",
            },
            {
                "title": "Semantic Retrieval",
                "description": "Uses dense sentence embeddings and FAISS similarity search to retrieve semantically relevant complaint evidence, overcoming keyword limitations.",
                "status": "Completed",
            },
            {
                "title": "Grounded Answer Generation",
                "description": "Generates concise answers from retrieved complaint context rather than relying solely on the language model's internal knowledge, improving factual accuracy.",
                "status": "Completed",
            },
            {
                "title": "Evidence Panel",
                "description": "The user interface explicitly displays the complaint excerpts that support the generated response, enhancing transparency and analyst trust.",
                "status": "Completed",
            },
            {
                "title": "Retrieval Evaluation",
                "description": "Achieved a 100% retrieval rate on the documented benchmark, where the top-5 relevant chunks were found for all benchmark questions.",
                "status": "Completed",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Sentence Transformers for Embeddings",
                "context": "Analyzing complaint narratives required semantic matching, as simple keyword search often missed relevant documents due to varied phrasing and informal language.",
                "decision": "Employed `all-MiniLM-L6-v2` from Sentence Transformers to generate compact and semantically rich 384-dimensional vector representations of complaint texts.",
                "outcome": "Enabled highly effective semantic retrieval across a large corpus of diverse complaint narratives, improving the ability to find contextually relevant information.",
            },
            {
                "title": "FAISS for Vector Retrieval",
                "context": "The project involved performing efficient similarity searches across a dataset of 1.37 million complaint records, requiring a fast and scalable vector indexing solution.",
                "decision": "Utilized FAISS (Facebook AI Similarity Search) as the dense vector index for its optimized algorithms for high-dimensional vector search.",
                "outcome": "Achieved rapid local vector retrieval, enabling near real-time querying of the massive complaint dataset without the overhead of a separate, complex database service.",
            },
            {
                "title": "Retrieval-Augmented Generation (RAG) Architecture",
                "context": "While large language models (LLMs) can generate human-like text, they often 'hallucinate' or produce answers not supported by specific source data, which is unacceptable for analytical tasks requiring evidence.",
                "decision": "Implemented a RAG architecture: first, retrieve relevant complaint evidence from the vector store, then provide this evidence as context to the generation model (FLAN-T5).",
                "outcome": "Ensured that all generated answers were grounded in actual retrieved complaint excerpts, significantly enhancing the trustworthiness and verifiability of the system's output for analysts.",
            },
        ],
        "challenges": [
            {
                "title": "Large Dataset Scale & Indexing Efficiency",
                "challenge": "Processing and indexing 1.37 million unstructured complaint records efficiently into a searchable format posed significant challenges in terms of computational resources and time.",
                "solution": "Developed an optimized preprocessing pipeline for data cleaning and text chunking, followed by the creation of a persisted FAISS vector store. This allowed for scalable and efficient indexing.",
                "impact": "Successfully indexed the entire 1.37 million dataset, making it queryable with acceptable performance and a reliable foundation for the RAG system.",
            },
            {
                "title": "Achieving Accurate Semantic Retrieval",
                "challenge": "Traditional keyword search proved inadequate for finding semantically related complaints, as different consumers often described similar issues using varied terminology.",
                "solution": "Implemented sentence-transformer embeddings to capture the semantic meaning of complaint narratives, and used dense vector similarity search in FAISS to retrieve contextually relevant documents.",
                "impact": "Enabled analysts to discover complaints related by meaning, not just keywords, leading to more comprehensive and insightful data exploration.",
            },
            {
                "title": "Ensuring Groundedness of Generated Answers",
                "challenge": "The risk of LLMs generating plausible but factually incorrect or unsupported answers was a major concern for an analytical tool requiring reliability and evidence.",
                "solution": "Adopted a RAG approach where the LLM's (FLAN-T5) generation was strictly conditioned on specific, retrieved complaint excerpts. The UI also exposed this evidence.",
                "impact": "Significantly improved the trustworthiness of the generated insights by providing verifiable evidence, allowing analysts to cross-reference and validate the information.",
            },
        ],
        "security_reliability": [
            {
                "title": "Persisted FAISS Index",
                "description": "The FAISS vector index is persisted to disk, ensuring data durability and rapid reloading for continuous operation without re-indexing the entire dataset.",
                "icon_name": "Save",
            },
            {
                "title": "Deterministic Preprocessing",
                "description": "The data preprocessing pipeline is designed to be deterministic, ensuring consistent embeddings and retrieval results for identical input data.",
                "icon_name": "RefreshCcw",
            },
            {
                "title": "Evaluation Pipeline",
                "description": "A dedicated evaluation framework and benchmark (CFPB complaints, business questions, retrieval rate metric) ensure the system's performance is measurable and auditable.",
                "icon_name": "BarChart3",
            },
            {
                "title": "Evidence Visibility",
                "description": "The Gradio interface explicitly displays the raw complaint excerpts used to formulate answers, allowing human analysts to verify the grounding and build trust in the system.",
                "icon_name": "Eye",
            },
            {
                "title": "Separation of Concerns",
                "description": "The RAG pipeline components (preprocessing, indexing, retrieval, generation, UI) are logically separated, enhancing modularity, maintainability, and testability.",
                "icon_name": "Layers",
            },
        ],
        "results": [
            "An AI-powered RAG application successfully processing and indexing 1.37 million CFPB consumer complaints.",
            "Demonstrated 100% retrieval rate on the documented benchmark, where the top-5 relevant chunks were found for all benchmark queries.",
            "Implemented a comprehensive RAG pipeline showcasing data preprocessing, semantic embedding, vector indexing, retrieval, and grounded generation.",
            "Developed an evidence-based Gradio interface for interactive querying and transparent display of generated answers with supporting complaint excerpts.",
            "This project serves as a robust proof-of-concept for applying RAG to large-scale, unstructured datasets for analytical insights.",
        ],
        "lessons_learned": [
            "Building large-scale RAG systems necessitates meticulous data preprocessing and chunking before any meaningful evaluation of retrieval quality can be performed.",
            "Semantic retrieval, powered by dense embeddings, proves invaluable in datasets where users describe similar issues using diverse terminology, significantly enhancing discovery over keyword search.",
            "Implementing evidence panels within the user interface is critical for building user trust and making generated answers inspectable and verifiable, addressing the 'black box' problem of LLMs.",
            "It is essential to understand and evaluate retrieval quality and generation quality as distinct problems, as improvements in one do not automatically guarantee improvements in the other.",
        ],
        "sort_order": 2,  # This ensures it appears after Swift Addis (sort_order: 1)
    },
    {
        "slug": "christian-digital-content-platform",
        "title": "Christian Digital Content Platform - Backend API",
        "tagline": "Scalable backend API powering Christian digital content, books, user libraries, and reading experiences.",
        "summary": "A scalable RESTful backend API for a Christian digital content platform, providing authentication, role-based access control, Christian articles and devotionals, digital book catalog management, user libraries, and reading progress.",
        "category": "backend-systems",
        "category_label": "Backend & Admin System",
        "technologies": [
            "NestJS 11",
            "TypeScript",
            "PostgreSQL",
            "Prisma 6",
            "Redis",
            "JWT",
            "RBAC",
            "Docker",
            "Swagger / OpenAPI",
            "Neon",
        ],
        "featured": True,
        "role": "Backend Engineer",
        "timeline": "In Development / MVP",
        "status": "In Development",
        "impact_metrics": [
            "Modular NestJS backend architecture for maintainability and scalability.",
            "Secure API endpoints with JWT authentication and role-based access control.",
        ],
        "github_url": "https://github.com/jossieT/christian-content-platform-api",
        "live_url": None,
        "overview": "The Christian Digital Content Platform is a scalable backend API designed to serve a multi-tenant digital content ecosystem. It provides foundational services for user authentication, content management (articles, devotionals), a digital book store, and user-specific libraries including reading progress. The API is built with a focus on maintainability, security, and performance using modern NestJS and Prisma technologies.",
        "problem": "Developing a robust platform for digital Christian content requires more than just content storage. It involves secure user management, differentiated access levels (user, creator, admin), a structured book catalog, personal user libraries, and tracking reading progress. The challenge is to build a scalable, secure, and maintainable backend that can evolve to support diverse content types and user interactions without compromising data integrity or performance.",
        "solution": "Implemented a modular NestJS backend API with TypeScript, leveraging PostgreSQL as the primary database and Prisma ORM for type-safe data access. The solution incorporates JWT authentication with refresh tokens and role-based access control (RBAC) to manage user permissions. Core functionalities include comprehensive APIs for articles, devotionals, digital books, and user libraries. The entire application is Dockerized for consistent development and deployment, and documented via Swagger/OpenAPI.",
        "architecture_diagram": None,
        "architecture_mermaid": """
graph TD
    A[Client Applications] --> B(NestJS REST API)

    subgraph NestJS REST API
        B1[Controllers] --> B2[DTO Validation / Guards]
        B2 --> B3[Services / Business Logic]
        B3 --> B4[Prisma ORM]
    end

    B4 --> C[PostgreSQL / Neon]
    B3 --> D[Redis (Caching/Sessions)]

    subgraph Authentication Flow
        Client --> AF1[Auth Controller]
        AF1 --> AF2[JWT Access Token]
        AF2 --> AF3[Refresh Token]
        AF1 -- Uses --> AF4[Role / Permission Guards]
        AF3 --> AF4
        AF4 --> AF5[Protected API Resources]
    end
    """,
        "architecture_steps": [
            {
                "title": "Authentication & Authorization",
                "description": "Implements JWT-based authentication with refresh tokens and role-based access control for USER, CREATOR, and ADMIN roles.",
            },
            {
                "title": "Content Management",
                "description": "Provides structured REST APIs for managing Christian articles, devotionals, and other digital content.",
            },
            {
                "title": "Digital Book Store",
                "description": "Provides backend services for digital book catalog and related user access functionality.",
            },
            {
                "title": "User Library & Reading Progress",
                "description": "Maintains user library state and reading progress through relational PostgreSQL data models managed by Prisma.",
            },
            {
                "title": "Data Access Layer",
                "description": "Uses Prisma ORM with PostgreSQL to provide typed database access, schema migrations, and relational data management.",
            },
            {
                "title": "Caching / Session Infrastructure",
                "description": "Uses Redis for caching and session management within the platform to enhance performance and responsiveness.",
            },
        ],
        "tech_stack_grouped": {
            "backend": [
                {
                    "name": "NestJS 11",
                    "purpose": "Modular, scalable Node.js framework for building REST APIs.",
                },
                {"name": "Node.js", "purpose": "JavaScript runtime environment."},
                {
                    "name": "TypeScript",
                    "purpose": "Superset of JavaScript for type-safe development.",
                },
            ],
            "database": [
                {
                    "name": "PostgreSQL",
                    "purpose": "Primary relational database for structured data storage.",
                },
                {
                    "name": "Neon",
                    "purpose": "Serverless PostgreSQL for scalable and managed database infrastructure.",
                },
                {
                    "name": "Prisma 6",
                    "purpose": "ORM and database access layer for type-safe queries and schema migrations.",
                },
            ],
            "caching": [
                {
                    "name": "Redis",
                    "purpose": "In-memory data store for caching and session management.",
                }
            ],
            "authentication_security": [
                {"name": "JWT", "purpose": "JSON Web Tokens for secure API authentication."},
                {
                    "name": "Refresh Tokens",
                    "purpose": "Mechanism for securely renewing access tokens.",
                },
                {
                    "name": "RBAC",
                    "purpose": "Role-Based Access Control for managing user permissions (USER, CREATOR, ADMIN).",
                },
            ],
            "infrastructure": [
                {
                    "name": "Docker",
                    "purpose": "Containerization for consistent development and deployment environments.",
                },
                {
                    "name": "Docker Compose",
                    "purpose": "Tool for defining and running multi-container Docker applications locally.",
                },
            ],
            "api": [
                {
                    "name": "Swagger / OpenAPI",
                    "purpose": "Automatic generation of interactive API documentation.",
                },
                {
                    "name": "API Versioning",
                    "purpose": "Versioned REST API endpoints under `/api/v1`.",
                },
            ],
        },
        "key_features": [
            {
                "title": "JWT Authentication & Refresh Tokens",
                "description": "Secure user authentication with JWT access tokens and long-lived refresh tokens.",
                "status": "Completed",
            },
            {
                "title": "Role-Based Access Control",
                "description": "Granular permissions for USER, CREATOR, and ADMIN roles across API resources.",
                "status": "Completed",
            },
            {
                "title": "Christian Articles & Devotionals",
                "description": "APIs for managing and retrieving diverse Christian content, including articles and daily devotionals.",
                "status": "Completed",
            },
            {
                "title": "Digital Book Catalog",
                "description": "Structured management of digital book metadata and availability within the platform's store.",
                "status": "Completed",
            },
            {
                "title": "User Digital Library",
                "description": "Functionality to manage user-owned or accessible digital content libraries.",
                "status": "Completed",
            },
            {
                "title": "Reading Progress Tracking",
                "description": "APIs for recording and syncing user reading progress within digital content.",
                "status": "Completed",
            },
            {
                "title": "Swagger/OpenAPI Documentation",
                "description": "Automatically generated, interactive API documentation for easy developer integration and testing.",
                "status": "Completed",
            },
            {
                "title": "API Versioning",
                "description": "Maintained API stability and evolution with explicit versioning under /api/v1.",
                "status": "Completed",
            },
        ],
        "engineering_decisions": [
            {
                "title": "NestJS Modular Architecture",
                "context": "The platform contains multiple business domains including authentication, content, books, users, and libraries. This requires a structured approach to maintain code quality and scalability.",
                "decision": "Adopted NestJS's modular architecture to separate domain responsibilities, encapsulate features, and ensure the backend remains maintainable and extensible as the platform grows.",
                "outcome": "Facilitated independent development of features, improved code organization, and allowed for clear separation of concerns, leading to a more robust and scalable codebase.",
            },
            {
                "title": "Prisma + PostgreSQL for Data Layer",
                "context": "The platform requires strong relational data consistency between users, roles, content, books, libraries, and reading state. Type-safety is crucial for developer experience and reducing runtime errors.",
                "decision": "Chose PostgreSQL for its relational integrity and features, combined with Prisma ORM for its powerful, type-safe database access, migrations, and schema management capabilities.",
                "outcome": "Ensured data consistency, provided a highly productive developer experience with auto-generated types, and streamlined database schema evolution.",
            },
            {
                "title": "JWT Authentication & RBAC",
                "context": "Different users (USER, CREATOR, ADMIN) require distinct capabilities and access levels across the platform's resources, necessitating a flexible and secure authorization mechanism.",
                "decision": "Implemented JWT authentication for stateless and scalable API security, coupled with a robust Role-Based Access Control (RBAC) system using NestJS Guards to enforce permissions based on predefined roles.",
                "outcome": "Provided secure, granular access control across the API, ensuring users can only access authorized resources and simplifying permission management.",
            },
            {
                "title": "Docker for Environment Consistency",
                "context": "Ensuring consistent development, testing, and production environments is critical to avoid 'it works on my machine' issues and streamline deployment.",
                "decision": "Containerized the backend application and its supporting services (PostgreSQL, Redis) using Docker and Docker Compose.",
                "outcome": "Achieved reproducible environments, simplified onboarding for new developers, and streamlined the deployment pipeline by ensuring environmental parity.",
            },
        ],
        "challenges": [
            {
                "title": "Multi-Role Authorization Logic",
                "challenge": "Implementing a flexible yet secure authorization system where different user roles (USER, CREATOR, ADMIN) have varying access to API resources.",
                "solution": "Integrated JWT authentication with a custom Role-Based Access Control (RBAC) system using NestJS guards and decorators, dynamically checking user roles against required permissions for each endpoint.",
                "impact": "Ensured secure and fine-grained access control, preventing unauthorized access and maintaining data integrity across the platform.",
            },
            {
                "title": "Relational Content & Library Data Modeling",
                "challenge": "Designing a database schema that accurately represents complex, interconnected relationships between users, roles, various content types (articles, devotionals), books, user libraries, and reading progress.",
                "solution": "Developed a normalized PostgreSQL relational model managed by Prisma, carefully defining relationships and constraints. Prisma's migration system facilitated iterative schema evolution.",
                "impact": "Ensured data consistency and integrity across all connected entities, supporting complex queries and providing a solid foundation for future features.",
            },
            {
                "title": "Maintaining Backend Scalability & Modularity",
                "challenge": "Managing the growth of a platform with multiple distinct business domains (auth, content, store, library) while keeping the codebase organized, scalable, and easy to maintain.",
                "solution": "Leveraged NestJS's modular architecture, breaking down the application into domain-specific modules. This enforced separation of concerns and allowed for independent development and testing of features.",
                "impact": "Improved code organization, enhanced developer productivity, and ensured the platform could scale both in terms of features and traffic without becoming a monolithic codebase.",
            },
        ],
        "security_reliability": [
            {
                "title": "JWT Authentication",
                "description": "Secured all API endpoints using JSON Web Tokens to verify user identity and prevent unauthorized access.",
                "icon_name": "Key",
            },
            {
                "title": "Refresh Token Mechanism",
                "description": "Implemented refresh token rotation to enhance security and provide a seamless user experience for prolonged sessions.",
                "icon_name": "RefreshCcw",
            },
            {
                "title": "Role-Based Access Control (RBAC)",
                "description": "Enforced granular permissions based on user roles (USER, CREATOR, ADMIN) to control access to specific functionalities and data.",
                "icon_name": "ShieldCheck",
            },
            {
                "title": "DTO & Request Validation",
                "description": "Utilized DTOs (Data Transfer Objects) with class-validator to ensure all incoming API requests conform to predefined schemas, mitigating data integrity issues and common attack vectors.",
                "icon_name": "CheckSquare",
            },
            {
                "title": "Protected Routes & Guards",
                "description": "Implemented NestJS Guards to protect sensitive API routes, ensuring only authenticated and authorized users can access them.",
                "icon_name": "Lock",
            },
            {
                "title": "Relational Database Constraints",
                "description": "Leveraged PostgreSQL's relational capabilities and Prisma's schema definitions to enforce data integrity through foreign keys, unique constraints, and referential actions.",
                "icon_name": "Database",
            },
            {
                "title": "Prisma Migrations",
                "description": "Managed database schema evolution using Prisma Migrations, ensuring consistency between the application's data models and the PostgreSQL database.",
                "icon_name": "Code",
            },
        ],
        "results": [
            "Modular NestJS backend architecture promoting maintainability and scalability across multiple product domains.",
            "Secure JWT authentication and refresh-token flow for robust user identity verification.",
            "Granular Role-Based Authorization for managing complex access control requirements.",
            "Reliable PostgreSQL/Prisma data layer for consistent and type-safe data access.",
            "Comprehensive Digital Content and Book Management APIs.",
            "User library and reading progress functionality for personalized user experiences.",
            "Dockerized development and deployment environment ensuring consistency.",
            "Automatically generated Swagger/OpenAPI API documentation for clear API contracts.",
        ],
        "lessons_learned": [
            "A modular backend architecture (e.g., with NestJS) is crucial for managing the complexity of platforms that encompass multiple distinct product domains, enabling independent development and scaling.",
            "Relational modeling in PostgreSQL with a robust ORM like Prisma is indispensable when users, content, books, libraries, and reading state are tightly interconnected, ensuring data integrity and query efficiency.",
            "Designing authentication and authorization (JWT + RBAC) as core platform infrastructure from the outset, rather than an afterthought, significantly enhances security, consistency, and simplifies endpoint protection.",
            "Comprehensive API documentation (Swagger/OpenAPI) becomes increasingly vital as the number of backend resources and endpoints grows, facilitating seamless integration for frontend and third-party consumers.",
        ],
        "sort_order": 1,
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
            "Python 3.12",
            "FastAPI",
            "LLM Function Calling",
            "LangChain",
            "PostgreSQL",
            "Docker",
            "JSON Schema",
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
                {
                    "name": "React / Next.js",
                    "purpose": "Interactive agent trace explorer showing step-by-step reasoning nodes",
                },
                {
                    "name": "Framer Motion",
                    "purpose": "Smooth node expansion and animated state transitions during execution",
                },
            ],
            "backend": [
                {
                    "name": "FastAPI",
                    "purpose": "Async backend hosting tool registry and agent execution runners",
                },
                {
                    "name": "Python 3.12",
                    "purpose": "Core agent state machine, reflection loops, and tool sandboxing",
                },
                {
                    "name": "LangChain / Custom Graph",
                    "purpose": "Agent state management and tool execution orchestration",
                },
            ],
            "database": [
                {
                    "name": "PostgreSQL 17",
                    "purpose": "Persistent storage for agent execution traces, tool logs, and token budgets",
                },
            ],
            "infrastructure": [
                {
                    "name": "Docker",
                    "purpose": "Sandboxed container execution environment for system tool commands",
                },
                {
                    "name": "JSON Schema / Pydantic",
                    "purpose": "Strict validation layer ensuring typed model tool parameters",
                },
            ],
            "ai": [
                {
                    "name": "GPT-4o / Claude 3.5 Sonnet",
                    "purpose": "Function calling and dynamic error reflection reasoning",
                },
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
        "sort_order": 4,
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
            "Nginx",
            "Linux",
            "Web Servers",
            "Infrastructure",
            "Monitoring",
            "CI/CD",
            "Bash",
            "System Reliability",
            "Security",
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
            "Python",
            "FastAPI",
            "TypeScript",
            "NestJS",
            "Node.js",
            "PostgreSQL",
            "Redis",
            "Docker",
            "REST APIs",
            "SQLAlchemy",
            "AWS",
            "Git",
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
            "Active Directory",
            "Windows Server",
            "Linux",
            "System Administration",
            "Network Infrastructure",
            "RBAC",
            "Hardware Maintenance",
            "Incident Management",
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
            {
                "name": "AI Agents & Tool Calling",
                "level": "Advanced",
                "is_core": True,
                "sort_order": 3,
            },
            {
                "name": "LlamaIndex & LangChain",
                "level": "Advanced",
                "is_core": False,
                "sort_order": 4,
            },
            {
                "name": "Hybrid Search (BM25 + Vector)",
                "level": "Expert",
                "is_core": True,
                "sort_order": 5,
            },
            {
                "name": "Prompt Engineering & Eval",
                "level": "Advanced",
                "is_core": False,
                "sort_order": 6,
            },
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
            {
                "name": "TypeScript & Node.js",
                "level": "Proficient",
                "is_core": False,
                "sort_order": 5,
            },
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
            {
                "name": "Docker & Docker Compose",
                "level": "Expert",
                "is_core": True,
                "sort_order": 0,
            },
            {"name": "Kubernetes", "level": "Advanced", "is_core": True, "sort_order": 1},
            {"name": "OpenShift", "level": "Advanced", "is_core": True, "sort_order": 2},
            {"name": "Linux System Admin", "level": "Expert", "is_core": True, "sort_order": 3},
            {"name": "AWS Cloud Services", "level": "Advanced", "is_core": True, "sort_order": 4},
            {
                "name": "CI/CD & GitHub Actions",
                "level": "Advanced",
                "is_core": False,
                "sort_order": 5,
            },
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
        "technologies": [
            "Python",
            "FastAPI",
            "PostgreSQL",
            "pgvector",
            "Redis",
            "LlamaIndex",
            "Docker",
        ],
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
        "technologies": [
            "Python",
            "FastAPI",
            "PostgreSQL",
            "SQLAlchemy",
            "Redis",
            "Pydantic",
            "Docker",
        ],
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
    session.query(Experience).filter(~Experience.slug.in_(current_slugs)).delete(
        synchronize_session=False
    )
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

        session.execute(Skill.__table__.delete().where(Skill.category_id == category_id))
        session.execute(
            Skill.__table__.insert(),
            [
                {"category_id": category_id, **{k: v for k, v in s.items() if k != "category_id"}}
                for s in skills
            ],
        )
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

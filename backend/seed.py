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
            ],
        "sort_order": 1,
    },

    {
        "slug": "telegram-medical-data-warehouse",
        "title": "Medical Data Warehouse (Telegram ELT)",
        "tagline": "Scalable Telegram ELT pipeline, Star Schema data warehouse, and Dagster orchestration for medical channel intelligence",
        "summary": "A robust ELT data pipeline designed to scrape, store, and analyze Telegram data from Ethiopian medical business channels using Telethon, PostgreSQL, dbt, and Dagster with YOLO-based image enrichment.",
        "category": "data-engineering",
        "category_label": "Data Engineering",
        "technologies": [
            "Python 3.10+",
            "Telethon",
            "PostgreSQL 15",
            "dbt",
            "Dagster",
            "Docker & Compose",
            "YOLO",
            "Star Schema",
            "SQL",
        ],
        "featured": True,
        "role": "Data Engineer / Pipeline Architect",
        "timeline": "Completed",
        "status": "Completed",
        "impact_metrics": [
            "Automated extraction from Ethiopian medical Telegram channels with partitioned raw data lake storage",
            "Star Schema data warehouse modeling with dbt (Facts & Dimensions) and automated data integrity tests",
            "Dagster orchestration for end-to-end execution, retries, YOLO object detection enrichment, and automated mart rebuilds",
        ],
        "github_url": "https://github.com/jossieT/telegram-medical-data-warehouse",
        "live_url": None,
        "overview": "The Medical Data Warehouse project is a robust, production-grade ELT (Extract, Load, Transform) pipeline designed to extract, ingest, transform, and analyze public Telegram data from Ethiopian medical business channels. By combining Telethon for automated scraping, local partitioned raw data lakes, PostgreSQL in Docker, dbt for Star Schema dimensional modeling, Dagster for workflow orchestration, and YOLO for media enrichment, the platform turns unstructured social messaging feeds into structured analytical intelligence.",
        "problem": "Medical businesses and pharmacies in Ethiopia frequently use public Telegram channels to share inventory, product updates, and business communications. However, this data is completely unstructured, distributed across thousands of message feeds, and mixed with image attachments. Without an automated ELT pipeline, tracking trends, auditing product availability, analyzing engagement metrics, and deriving actionable healthcare insights at scale is virtually impossible.",
        "solution": "Architected and built an end-to-end ELT system that extracts raw messages and images using Python and Telethon, stores payloads in a partitioned raw data lake, ingests them into PostgreSQL via a robust data loader, transforms the raw data into an analytical Star Schema (fct_messages, dim_channels, dim_dates) using dbt, enriches images with YOLO object detection, and orchestrates the entire lifecycle with Dagster for automated scheduling, retries, and monitoring.",
        "architecture_diagram": None,
        "architecture_mermaid": """
graph TD
    A[Telegram Medical Channels] -->|Telethon Scraper| B[Local Raw Data Lake]
    B -->|Partitioned JSON & Images| C[Database Loader]
    C -->|Raw Ingestion| D[(PostgreSQL 15 Data Warehouse)]
    D -->|dbt Staging Models| E[dbt Transformations]
    E -->|Star Schema Marts| F[Fact & Dimension Tables\nfct_messages, dim_channels, dim_dates]
    F -->|Image Payloads| G[YOLO Image Enrichment]
    G -->|Enriched Detections| F
    H[Dagster Orchestrator] -.->|Manages & Schedules| A
    H -.->|Triggers| C
    H -.->|Executes| E
    H -.->|Coordinates| G
""",
        "architecture_steps": [
            {
                "title": "Telegram Data Extraction",
                "description": "Python and Telethon scrape message text, metadata, view counts, and image assets from targeted Ethiopian medical channels.",
            },
            {
                "title": "Raw Data Lake Storage",
                "description": "Saves original API responses as raw JSON files partitioned by date and downloads raw images locally to preserve original payload fidelity.",
            },
            {
                "title": "PostgreSQL Ingestion",
                "description": "A dedicated loader script validates and ingests raw JSON data into the raw staging tables of a containerized PostgreSQL 15 database.",
            },
            {
                "title": "dbt Star Schema Modeling",
                "description": "dbt compiles and executes SQL transformations converting raw records into analytical fact (fct_messages) and dimension (dim_channels, dim_dates) tables.",
            },
            {
                "title": "YOLO Media Enrichment",
                "description": "Computer vision model inspects medical channel images for detected objects and enriches fact tables with visual intelligence.",
            },
            {
                "title": "Dagster Orchestration",
                "description": "Dagster manages dependency graphs (scrape_telegram_data -> load_raw_to_postgres -> run_dbt_transformations -> run_yolo_enrichment), providing retries, logs, and a unified execution dashboard.",
            },
            {
                "title": "Data Quality Testing & Docs",
                "description": "Automated dbt tests enforce uniqueness, non-negative views, and date validation while generating interactive schema documentation.",
            },
        ],
        "tech_stack_grouped": {
            "scraping_extraction": [
                {
                    "name": "Telethon",
                    "purpose": "Asynchronous Telegram client library for extracting messages and media from channels.",
                },
                {
                    "name": "Python 3.10+",
                    "purpose": "Core scripting language for scraping, ingestion, and pipeline logic.",
                },
            ],
            "database_warehouse": [
                {
                    "name": "PostgreSQL 15",
                    "purpose": "Relational data warehouse hosting raw schemas, staging models, and dimensional marts.",
                },
                {
                    "name": "Docker & Compose",
                    "purpose": "Containerized database environment running on isolated port 5433.",
                },
            ],
            "transformation_modeling": [
                {
                    "name": "dbt (data build tool)",
                    "purpose": "Modular SQL transformations, Star Schema modeling, automated testing, and documentation.",
                }
            ],
            "orchestration": [
                {
                    "name": "Dagster",
                    "purpose": "Data pipeline orchestration, dependency tracking, automated retries, and run monitoring.",
                }
            ],
            "ai_enrichment": [
                {
                    "name": "YOLO",
                    "purpose": "Object detection model for extracting insights and entity metadata from channel images.",
                }
            ],
            "devops_ci": [
                {
                    "name": "GitHub Actions",
                    "purpose": "Automated linting (flake8), unit testing, and dbt model compilation.",
                }
            ],
        },
        "key_features": [
            {
                "title": "Telegram Channel Scraper",
                "description": "Extracts full historical and real-time message payloads and image assets from Ethiopian medical Telegram channels.",
                "status": "Completed",
            },
            {
                "title": "Partitioned Raw Data Lake",
                "description": "Stores raw API responses in date-partitioned JSON files and raw image folders to allow full replayability.",
                "status": "Completed",
            },
            {
                "title": "dbt Star Schema Transformations",
                "description": "Implements fct_messages, dim_channels, and dim_dates tables for high-performance analytical queries.",
                "status": "Completed",
            },
            {
                "title": "YOLO Image Enrichment",
                "description": "Runs visual detection models across downloaded channel images to identify medical supplies and product imagery.",
                "status": "Completed",
            },
            {
                "title": "Dagster Pipeline Orchestration",
                "description": "Visual DAG execution, scheduled pipeline runs, failure handling, and end-to-end operational observability.",
                "status": "Completed",
            },
            {
                "title": "Automated Data Integrity Tests",
                "description": "Custom and built-in dbt tests checking for duplicate messages, future date anomalies, and non-negative metric values.",
                "status": "Completed",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Decoupling Extraction from Database Loading",
                "context": "Extracting from Telegram API is rate-limited and network-dependent, while database loading requires schema consistency.",
                "decision": "Separated Telethon scraping from Postgres ingestion via a raw JSON/image data lake stage.",
                "outcome": "Allowed safe offline re-ingestion, simplified debugging, and insulated database operations from Telegram network fluctuations.",
            },
            {
                "title": "Star Schema Modeling with dbt",
                "context": "Unstructured JSON payloads are inefficient and difficult for analysts and dashboards to query directly.",
                "decision": "Utilized dbt to structure the warehouse into facts (fct_messages) and dimensions (dim_channels, dim_dates).",
                "outcome": "Enabled modular SQL transformations, rapid analytics querying, automated lineage generation, and built-in data tests.",
            },
            {
                "title": "Dagster for Unified Orchestration",
                "context": "Pipeline stages (scrape -> load -> transform -> enrich) have strict dependencies and require retry policies.",
                "decision": "Orchestrated all pipeline assets and jobs using Dagster instead of simple cron scripts.",
                "outcome": "Delivered end-to-end observability, dependency tracking, UI-driven run management, and automated scheduling.",
            },
            {
                "title": "Dockerized Database Configuration",
                "context": "Need for a reproducible PostgreSQL environment that does not collide with local database instances.",
                "decision": "Configured PostgreSQL 15 via Docker Compose with dedicated mapping to port 5433.",
                "outcome": "Guaranteed zero environment conflicts, straightforward onboarding, and consistent local-to-production parity.",
            },
        ],
        "challenges": [
            {
                "title": "Rate Limits and Telegram Session Management",
                "challenge": "Telegram API applies strict rate limits and requires secure credential management across authentication sessions.",
                "solution": "Implemented resilient scraping logic with Telethon handling session files, backoff delays, and selective batch extraction.",
                "impact": "Prevented account throttling and ensured stable extraction across configured medical channels.",
            },
            {
                "title": "Handling Unstructured and Missing Data",
                "challenge": "Telegram posts exhibit variable structures, missing fields, forwarded content, and non-standard timestamps.",
                "solution": "Built a schema validation loader step alongside dbt staging models that normalize and cast heterogeneous data types.",
                "impact": "Achieved clean dimensional tables without losing original payload context in the raw data lake.",
            },
            {
                "title": "Coordinating Multi-Stage Pipeline Dependencies",
                "challenge": "Computer vision YOLO enrichment requires downloaded image assets and completed dbt staging models before finalizing marts.",
                "solution": "Defined a rigorous Dagster asset dependency graph ensuring deterministic step execution and automated mart rebuilds.",
                "impact": "Eliminated race conditions and guaranteed data consistency across all warehouse tables.",
            },
        ],
        "security_reliability": [
            {
                "title": "Isolated Environment Configuration",
                "description": "Telegram credentials, API hashes, and database passwords are kept strictly isolated in uncommitted .env files.",
                "icon_name": "Lock",
            },
            {
                "title": "dbt Data Quality Assertions",
                "description": "Automated dbt test suite verifying uniqueness, non-negative view counts, and future date constraints.",
                "icon_name": "CheckCircle2",
            },
            {
                "title": "CI/CD Validation Pipeline",
                "description": "GitHub Actions workflow running flake8 linting, Python unit tests, and dbt compilation on every pull request.",
                "icon_name": "Shield",
            },
            {
                "title": "Docker Container Isolation",
                "description": "Containerized PostgreSQL 15 database running on custom port 5433 to eliminate port collisions.",
                "icon_name": "Database",
            },
        ],
        "results": [
            "Automated scraping and transformation pipeline processing Ethiopian medical Telegram feeds.",
            "Production-ready Star Schema data warehouse with automated fact and dimension models via dbt.",
            "End-to-end Dagster orchestration with full pipeline visualization, retries, and scheduled execution.",
            "Integrated YOLO computer vision enrichment for extracted medical media and product imagery.",
            "Comprehensive dbt test suite and CI workflow enforcing 100% data integrity on every build.",
        ],
        "lessons_learned": [
            "Maintaining raw payload data lakes before relational ingestion is crucial for ELT flexibility and pipeline idempotency.",
            "dbt transforms complex raw messaging logs into clean, analyst-friendly dimensional models while maintaining lineage.",
            "Orchestrators like Dagster provide critical observability and retry resilience that standalone scripts cannot match.",
        ],
        "sort_order": 2,
        "related_slugs": ["rag-complaint-chatbot", "swift-addis-car-detailing-platform"],
    },

    {
        "slug": "etbooking-solutions",
        "title": "ETBooking Solutions",
        "tagline": "Premium digital platform for custom booking and appointment solutions",
        "summary": "A modern, bilingual enterprise website for ETBooking Solutions, showcasing custom booking and appointment management solutions for service-based businesses across Ethiopia.",
        "category": "full-stack-web",
        "category_label": "Full-Stack Web Platform",
        "technologies": [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Shadcn UI",
            "Framer Motion",
            "React Hook Form",
            "Zod",
            "Lucide React",
        ],
        "featured": True,
        "role": "Full-Stack Developer",
        "timeline": "Ongoing",
        "status": "In Development",
        "impact_metrics": [
            "Bilingual digital presence supporting English and Amharic",
            "Service-focused platform targeting multiple appointment-based industries",
            "Localized for Ethiopian businesses with ETB pricing and Ethiopian phone formats",
        ],
        "github_url": "https://github.com/jossieT/etbooking-solutions",
        "live_url": "https://etbooking-solutions.vercel.app/",
        "overview": "ETBooking Solutions is a premium digital platform created for a company specializing in custom booking and appointment management systems for service-based businesses. The website acts as the company's primary digital presence, presenting its solutions, industry use cases, services, portfolio, pricing estimates, testimonials, FAQs, and consultation opportunities. The platform is designed around the needs of businesses such as car detailing services, car washes, barbershops, beauty salons, healthcare clinics, gyms, cleaning companies, professional service providers, educational institutions, and hospitality businesses.",
        "problem": "Service-based businesses often rely on manual appointment management, phone calls, messaging applications, and fragmented workflows. ETBooking Solutions needed a professional digital presence that clearly communicated its booking-system expertise, demonstrated the industries it serves, explained its services, and made it easy for prospective customers to estimate pricing and request consultations. The platform also needed to reflect the Ethiopian market through localized currency, phone formats, language support, and business context.",
        "solution": "Built a modern, responsive Next.js platform that positions ETBooking Solutions as a professional provider of custom booking and appointment-management systems. The website combines service and industry showcases with portfolio case studies, testimonials, consultation forms, FAQs, and a dynamic pricing calculator. The frontend uses a reusable component architecture with TypeScript, Tailwind CSS, Shadcn UI, and Framer Motion, while React Hook Form and Zod provide structured form handling and validation. English and Amharic localization, Ethiopian Birr support, responsive design, accessibility considerations, SEO metadata, structured data, and performance optimization make the platform suitable for both local and broader audiences.",
        "architecture_diagram": None,
        "architecture_mermaid": """
graph TD
    A[Visitor] --> B[Next.js Application]

    B --> C[App Router]
    B --> D[Reusable UI Components]
    B --> E[Localized Content]
    B --> F[Pricing Calculator]
    B --> G[Contact & Consultation Forms]

    D --> H[Shadcn UI]
    D --> I[Tailwind CSS]
    D --> J[Framer Motion]

    G --> K[React Hook Form]
    K --> L[Zod Validation]

    B --> M[SEO & Metadata]
    M --> N[Open Graph / Twitter Cards]
    M --> O[Structured Data]
    M --> P[Sitemap / Robots.txt]
""",
        "architecture_steps": [
            {
                "title": "Visitor Interaction",
                "description": "Visitors access the ETBooking Solutions website through desktop and mobile browsers to explore services, industries, portfolio projects, pricing, testimonials, and consultation opportunities.",
            },
            {
                "title": "Next.js Application",
                "description": "The application is built with Next.js and the App Router, providing the foundation for page routing, rendering, metadata, and the overall web application structure.",
            },
            {
                "title": "Reusable Component System",
                "description": "The interface is organized around reusable layout, section, shared, and UI components to maintain consistency and simplify future development.",
            },
            {
                "title": "Interactive User Experience",
                "description": "Framer Motion provides polished animations and transitions, while Tailwind CSS and Shadcn UI provide the visual and interaction foundation.",
            },
            {
                "title": "Forms & Validation",
                "description": "Contact and consultation interactions use React Hook Form for form state management and Zod for schema-based client-side validation.",
            },
            {
                "title": "Localization",
                "description": "The platform supports English and Amharic content while incorporating Ethiopian-specific business requirements such as ETB currency and Ethiopian phone number formats.",
            },
            {
                "title": "SEO & Discoverability",
                "description": "Metadata, Open Graph, Twitter Cards, structured data, sitemap generation, and robots.txt support search visibility and social sharing.",
            },
        ],
        "tech_stack_grouped": {
            "frontend": [
                {
                    "name": "Next.js",
                    "purpose": "Primary React framework powering the website and application routing.",
                },
                {
                    "name": "React",
                    "purpose": "Component-based UI development.",
                },
                {
                    "name": "TypeScript",
                    "purpose": "Type-safe application development.",
                },
                {
                    "name": "Tailwind CSS",
                    "purpose": "Utility-first styling and responsive interface development.",
                },
                {
                    "name": "Shadcn UI",
                    "purpose": "Reusable and accessible UI components.",
                },
            ],
            "animation": [
                {
                    "name": "Framer Motion",
                    "purpose": "UI animations, transitions, and interaction effects.",
                }
            ],
            "forms_validation": [
                {
                    "name": "React Hook Form",
                    "purpose": "Form state management and submission handling.",
                },
                {
                    "name": "Zod",
                    "purpose": "Schema-based form validation.",
                },
            ],
            "icons": [
                {
                    "name": "Lucide React",
                    "purpose": "Consistent interface iconography.",
                }
            ],
            "localization": [
                {
                    "name": "English",
                    "purpose": "Primary supported interface language.",
                },
                {
                    "name": "Amharic",
                    "purpose": "Localized language support for Ethiopian users.",
                },
                {
                    "name": "ETB",
                    "purpose": "Ethiopian Birr support for pricing presentation.",
                },
            ],
            "seo": [
                {
                    "name": "Next.js Metadata API",
                    "purpose": "Page metadata and search-engine optimization.",
                },
                {
                    "name": "Structured Data",
                    "purpose": "Provides machine-readable information for search engines.",
                },
                {
                    "name": "Sitemap",
                    "purpose": "Helps search engines discover website pages.",
                },
                {
                    "name": "Robots.txt",
                    "purpose": "Controls crawler access and indexing behavior.",
                },
            ],
            "infrastructure": [],
            "deployment": [],
        },
        "key_features": [
            {
                "title": "Service & Solution Showcase",
                "description": "Presents ETBooking Solutions' custom booking and appointment-management capabilities in a structured, professional format.",
                "status": "Completed",
            },
            {
                "title": "Multi-Industry Solutions",
                "description": "Communicates booking-system use cases across car detailing, car wash, barbershop, beauty, healthcare, fitness, cleaning, education, hospitality, and professional services.",
                "status": "Completed",
            },
            {
                "title": "Dynamic Pricing Calculator",
                "description": "Allows prospective customers to explore pricing estimates based on their potential solution requirements.",
                "status": "Completed",
            },
            {
                "title": "Bilingual Experience",
                "description": "Provides English and Amharic language support for a broader Ethiopian audience.",
                "status": "Completed",
            },
            {
                "title": "Consultation & Contact Flows",
                "description": "Provides structured contact and consultation-request experiences for potential customers.",
                "status": "Completed",
            },
            {
                "title": "Portfolio & Case Studies",
                "description": "Showcases previous work and demonstrates the company's ability to build solutions for service-based businesses.",
                "status": "Completed",
            },
            {
                "title": "Responsive Premium UI",
                "description": "Uses a responsive component architecture with Tailwind CSS, Shadcn UI, and Framer Motion to provide a polished experience across device sizes.",
                "status": "Completed",
            },
            {
                "title": "SEO & Performance Foundation",
                "description": "Includes metadata, Open Graph support, structured data, sitemap generation, responsive design, accessibility considerations, and performance optimization.",
                "status": "Completed",
            },
        ],
        "engineering_decisions": [
            {
                "title": "Next.js Application Architecture",
                "context": "The platform required a modern, performant web framework capable of supporting SEO, responsive pages, reusable components, and future expansion.",
                "decision": "Selected Next.js with the App Router as the primary application framework.",
                "outcome": "Provides a scalable foundation for the company's website while supporting modern rendering, routing, metadata, and future application features.",
            },
            {
                "title": "TypeScript for Application Development",
                "context": "The project contains reusable components, structured data, forms, and multiple interactive sections that benefit from stronger type safety.",
                "decision": "Used TypeScript throughout the application.",
                "outcome": "Improved maintainability, developer confidence, and consistency across components, data structures, and application logic.",
            },
            {
                "title": "Reusable UI Architecture",
                "context": "The website contains many repeated interface patterns across services, industries, portfolio items, FAQs, and other sections.",
                "decision": "Organized the frontend into reusable layout, section, shared, and UI components.",
                "outcome": "Reduced duplication and created a maintainable foundation for expanding the platform.",
            },
            {
                "title": "Schema-Based Form Validation",
                "context": "Contact and consultation forms require predictable and validated user input.",
                "decision": "Combined React Hook Form with Zod validation.",
                "outcome": "Created a structured and maintainable approach to handling interactive forms and validating submitted data.",
            },
            {
                "title": "Ethiopian Market Localization",
                "context": "The business targets service providers in Ethiopia and requires regionally appropriate presentation.",
                "decision": "Added English and Amharic support together with Ethiopian Birr and Ethiopian phone-number formatting.",
                "outcome": "Made the platform more relevant to its target market while retaining accessibility for English-speaking users.",
            },
        ],
        "challenges": [
            {
                "title": "Communicating a Complex Service Offering",
                "challenge": "ETBooking Solutions serves multiple industries and offers custom booking-system development, which can be difficult to communicate without overwhelming prospective customers.",
                "solution": "Structured the website around clear service categories, industry solutions, portfolio examples, pricing estimates, FAQs, testimonials, and consultation flows.",
                "impact": "Creates a clearer path for visitors to understand the company's offering and identify solutions relevant to their business.",
            },
            {
                "title": "Balancing Premium Design with Usability",
                "challenge": "The website needed a premium enterprise appearance while remaining easy to navigate and usable across different devices.",
                "solution": "Built a reusable responsive component system using Tailwind CSS and Shadcn UI, with Framer Motion used selectively for interaction and visual polish.",
                "impact": "Provides a consistent modern interface without sacrificing responsive behavior and usability.",
            },
            {
                "title": "Serving a Local and Bilingual Audience",
                "challenge": "The platform needed to communicate effectively with both English- and Amharic-speaking users while reflecting Ethiopian business requirements.",
                "solution": "Implemented bilingual content alongside ETB pricing and Ethiopian phone-number formatting.",
                "impact": "Improves accessibility and relevance for the intended Ethiopian market.",
            },
        ],
        "security_reliability": [
            {
                "title": "Zod Input Validation",
                "description": "Provides schema-based validation for structured user input submitted through forms.",
                "icon_name": "CheckCircle2",
            },
            {
                "title": "TypeScript Type Safety",
                "description": "Reduces common development errors by providing static type checking across the application.",
                "icon_name": "ShieldCheck",
            },
            {
                "title": "Accessibility Considerations",
                "description": "The project includes accessibility compliance as part of its development goals and UI implementation.",
                "icon_name": "Accessibility",
            },
            {
                "title": "SEO Foundation",
                "description": "Metadata, structured data, sitemap generation, and robots.txt provide a structured foundation for search discoverability.",
                "icon_name": "Search",
            },
            {
                "title": "Responsive Design",
                "description": "The interface is designed to work across desktop, tablet, and mobile screen sizes.",
                "icon_name": "MonitorSmartphone",
            },
        ],
        "results": [
            "Established a professional digital presence for ETBooking Solutions.",
            "Created a centralized platform for presenting booking and appointment-management solutions.",
            "Added industry-specific positioning for multiple service-based business categories.",
            "Implemented a dynamic pricing calculator for prospective customers.",
            "Provided English and Amharic language support with Ethiopian market localization.",
            "Built reusable frontend components for maintainability and future expansion.",
            "Added a strong SEO foundation including metadata, structured data, sitemap, and robots.txt.",
        ],
        "lessons_learned": [
            "A strong B2B product website needs to communicate the business problem and solution clearly rather than simply showcasing technical features.",
            "Reusable component architecture becomes increasingly important when a website contains many content-driven sections and repeated UI patterns.",
            "Localization is more than translating text; regional currency, phone formats, business context, and user expectations also matter.",
            "Premium visual design should support information hierarchy and conversion rather than becoming the primary purpose of the interface.",
            "Building the marketing foundation first creates a clear path toward future customer portals, booking demos, administrative systems, payments, analytics, and API integrations.",
        ],
        "sort_order": 4,
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
        "featured": True,
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
        "sort_order": 3,
        "related_slugs": ["telegram-medical-data-warehouse", "swift-addis-car-detailing-platform"],
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
        "featured": False,
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
        "sort_order": 5,
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
        "sort_order": 2,
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
        "sort_order": 0,
        "skills": [
            {"name": "Python 3.12", "level": "Expert", "is_core": True, "sort_order": 0},
            {"name": "FastAPI", "level": "Expert", "is_core": True, "sort_order": 1},
            {"name": "Pydantic v2", "level": "Expert", "is_core": True, "sort_order": 2},
            {"name": "SQLAlchemy 2.x (Async)", "level": "Expert", "is_core": True, "sort_order": 3},
            {"name": "REST API Design", "level": "Expert", "is_core": True, "sort_order": 4},
            {"name": "Node.js", "level": "Proficient", "is_core": False, "sort_order": 5},
            {"name": "Express", "level": "Proficient", "is_core": False, "sort_order": 6},
            {"name": "TypeScript", "level": "Proficient", "is_core": False, "sort_order": 7},
            {"name": "NestJS", "level": "Proficient", "is_core": False, "sort_order": 8},
        ],
    },
    {
        "slug": "cloud-infrastructure",
        "title": "Cloud & Infrastructure",
        "description": "Containerization, cluster orchestration, CI/CD pipelines, and cloud platform delivery.",
        "icon_name": "Cloud",
        "sort_order": 4,
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
        "sort_order": 1,
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
        "category": "ai-systems",
        "description": (
            "Build grounded AI knowledge systems that combine semantic and lexical retrieval for accurate, citation-aware answers."
        ),
        "deliverables": [
            "RAG & pgvector",
            "Hybrid BM25 + semantic search",
            "Citations & access control",
        ],
        "technologies": [
            "Python",
            "FastAPI",
            "PostgreSQL",
        ],
        "icon_name": "BrainCircuit",
        "sort_order": 0,
    },
    {
        "slug": "full-stack-software-development",
        "title": "Full-Stack Software Development",
        "category": "full-stack",
        "description": (
            "Build complete web applications from responsive interfaces and APIs to databases, authentication, and deployment."
        ),
        "deliverables": [
            "Next.js / React applications",
            "FastAPI / NestJS / Node.js APIs",
            "PostgreSQL / MongoDB & authentication",
        ],
        "technologies": [
            "Next.js",
            "React",
            "FastAPI",
            "NestJS",
        ],
        "icon_name": "Layers",
        "sort_order": 1,
    },
    {
        "slug": "backend-engineering",
        "title": "Backend Engineering",
        "category": "backend-engineering",
        "description": (
            "Design robust asynchronous APIs and backend services built for concurrency, security, and maintainability."
        ),
        "deliverables": [
            "FastAPI & asynchronous Python",
            "PostgreSQL & SQLAlchemy",
            "Redis, JWT & RBAC",
        ],
        "technologies": [
            "Python",
            "FastAPI",
            "PostgreSQL",
        ],
        "icon_name": "Server",
        "sort_order": 2,
    },
    {
        "slug": "cloud-native-platforms",
        "title": "Cloud-Native Platforms",
        "category": "cloud-native",
        "description": (
            "Containerize and deploy production backend services with reproducible infrastructure and automated delivery."
        ),
        "deliverables": [
            "Docker & multi-stage builds",
            "Kubernetes / OpenShift",
            "GitHub Actions CI/CD",
        ],
        "technologies": [
            "Docker",
            "Kubernetes",
            "OpenShift",
        ],
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
    print(f"  OK: {len(PROJECTS)} projects upserted")


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
    print(f"  OK: {len(EXPERIENCES)} experience entries upserted")


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
    valid_slugs = [s["slug"] for s in SERVICES]
    session.execute(Service.__table__.delete().where(~Service.slug.in_(valid_slugs)))
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
    print(f"  OK: {len(SERVICES)} services upserted")


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
    print(f"  OK: {len(ARTICLES)} articles upserted")


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
            print("\n[SUCCESS] Database seeded successfully!")
        except Exception as e:
            session.rollback()
            print(f"\n[FAILED] Seed failed: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()

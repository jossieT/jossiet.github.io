"""Pydantic schemas for AI Agent Tool inputs and structured outputs."""

from __future__ import annotations

from typing import Any, Optional
from pydantic import BaseModel, Field


# ─── Tool 1: search_projects ──────────────────────────────────────────────────

class SearchProjectsInput(BaseModel):
    """Input parameters for searching projects."""

    query: Optional[str] = Field(
        default=None,
        description="Search keyword or topic, e.g. 'RAG', 'booking', 'streaming', 'agent'.",
    )
    category: Optional[str] = Field(
        default=None,
        description="Optional category filter: 'ai', 'backend', 'fullstack', 'cloud'.",
    )
    technology: Optional[str] = Field(
        default=None,
        description="Optional technology tag to filter by, e.g. 'FastAPI', 'PostgreSQL', 'Docker'.",
    )
    limit: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Maximum number of projects to return.",
    )


class ProjectItemSummary(BaseModel):
    slug: str
    title: str
    summary: str
    category: str
    technologies: list[str]
    featured: bool
    url: str


class SearchProjectsOutput(BaseModel):
    total: int
    projects: list[ProjectItemSummary]


# ─── Tool 2: get_project ──────────────────────────────────────────────────────

class GetProjectInput(BaseModel):
    """Input parameters for retrieving a single project case study."""

    slug: str = Field(
        ...,
        description="The unique URL slug of the project, e.g. 'enterprise-ai-knowledge-platform', 'christian-digital-content-platform', 'intelligent-booking-engine', 'autonomous-ai-agent-orchestrator'.",
    )


class ArchitectureComponent(BaseModel):
    name: str
    purpose: str
    technology: str


class ProjectDetailOutput(BaseModel):
    found: bool
    slug: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    technologies: list[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    overview: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_overview: Optional[str] = None
    key_features: list[str] = []
    engineering_decisions: list[str] = []
    challenges_and_solutions: list[str] = []
    metrics: list[str] = []
    architecture_overview: list[ArchitectureComponent] = []
    url: Optional[str] = None


# ─── Tool 3: find_projects_by_technology ──────────────────────────────────────

class FindByTechnologyInput(BaseModel):
    """Input parameters for finding projects by technology."""

    technology: str = Field(
        ...,
        description="The technology name to search for, e.g. 'PostgreSQL', 'FastAPI', 'Redis', 'Docker', 'pgvector', 'Next.js'.",
    )
    limit: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Maximum number of projects to return.",
    )


class FindByTechnologyOutput(BaseModel):
    technology: str
    total: int
    projects: list[ProjectItemSummary]


# ─── Tool 4: get_experience ───────────────────────────────────────────────────

class GetExperienceInput(BaseModel):
    """Input parameters for querying Yosef's professional work experience."""

    technology: Optional[str] = Field(
        default=None,
        description="Filter experience where specific technology was utilized.",
    )
    role: Optional[str] = Field(
        default=None,
        description="Filter by role title keyword, e.g. 'Backend', 'AI', 'Infrastructure'.",
    )
    organization: Optional[str] = Field(
        default=None,
        description="Filter by company or organization name.",
    )


class ExperienceItemOutput(BaseModel):
    role: str
    company: str
    location: str
    period: str
    description: str
    highlights: list[str]
    technologies: list[str]
    url: str = "/experience"


class GetExperienceOutput(BaseModel):
    total: int
    items: list[ExperienceItemOutput]


# ─── Tool 5: get_services ─────────────────────────────────────────────────────

class GetServicesInput(BaseModel):
    """Input parameters for querying Yosef's consulting and engineering services."""

    category: Optional[str] = Field(
        default=None,
        description="Optional category filter: 'ai', 'backend', 'cloud', 'architecture'.",
    )


class ServiceItemOutput(BaseModel):
    slug: str
    title: str
    category: str
    description: str
    deliverables: list[str]
    technologies: list[str]
    url: str = "/services"


class GetServicesOutput(BaseModel):
    total: int
    services: list[ServiceItemOutput]


# ─── Tool 6: search_articles ──────────────────────────────────────────────────

class SearchArticlesInput(BaseModel):
    """Input parameters for searching published technical articles and thought leadership."""

    query: Optional[str] = Field(
        default=None,
        description="Search keyword, e.g. 'FastAPI', 'RAG', 'Kubernetes', 'OpenShift'.",
    )
    category: Optional[str] = Field(
        default=None,
        description="Optional category filter.",
    )
    limit: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Maximum number of articles to return.",
    )


class ArticleItemOutput(BaseModel):
    slug: str
    title: str
    summary: str
    tags: list[str]
    reading_time: str
    published_date: str
    url: str


class SearchArticlesOutput(BaseModel):
    total: int
    articles: list[ArticleItemOutput]


# ─── Tool 7: get_contact_information ──────────────────────────────────────────

class GetContactInput(BaseModel):
    """Input parameters for retrieving public contact information (no arguments required)."""
    pass


class ContactOutput(BaseModel):
    name: str = "Yosef Teshome"
    title: str = "AI Backend & Platform Engineer"
    email: str = "joseteshe2017@gmail.com"
    phone: str = "+251 977 784 658"
    github: str = "https://github.com/jossieT"
    linkedin: str = "https://www.linkedin.com/in/yosef-teshome-96516b188/"
    location: str = "Addis Ababa, Ethiopia (Available Globally / Remote)"
    availability: str = "Open for Senior AI Backend, RAG Platform, and Distributed Systems roles & select consulting engagements."
    contact_url: str = "/contact"


# ─── Tool 8: search_knowledge_rag ────────────────────────────────────────────

class SearchKnowledgeRagInput(BaseModel):
    """Input parameters for deep semantic knowledge retrieval over portfolio case studies."""

    query: str = Field(
        ...,
        description="The detailed technical question or topic to search via pgvector semantic similarity.",
    )
    top_k: int = Field(
        default=4,
        ge=1,
        le=8,
        description="Number of relevant knowledge chunks to retrieve.",
    )


class KnowledgeChunkOutput(BaseModel):
    title: str
    section: str
    content: str
    source_type: str
    source_title: str
    source_url: str
    similarity: float


class SearchKnowledgeRagOutput(BaseModel):
    query: str
    total_found: int
    chunks: list[KnowledgeChunkOutput]

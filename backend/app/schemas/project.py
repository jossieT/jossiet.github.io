"""Pydantic schemas for portfolio projects / case studies."""

from __future__ import annotations

from app.schemas.base import CamelModel


class ArchitectureStep(CamelModel):
    title: str
    description: str


class KeyFeature(CamelModel):
    title: str
    description: str
    status: str = "Completed"  # "Completed" | "Planned" | "In Progress"


class EngineeringDecision(CamelModel):
    title: str
    context: str
    decision: str
    outcome: str


class TechStackItem(CamelModel):
    name: str
    purpose: str
    icon: str | None = None


class TechStackGrouped(CamelModel):
    frontend: list[TechStackItem] = []
    backend: list[TechStackItem] = []
    database: list[TechStackItem] = []
    infrastructure: list[TechStackItem] = []
    ai: list[TechStackItem] = []
    deployment: list[TechStackItem] = []


class ProjectChallenge(CamelModel):
    title: str
    challenge: str
    solution: str
    impact: str


class SecurityReliabilityItem(CamelModel):
    title: str
    description: str
    icon_name: str | None = None


class ProjectListItem(CamelModel):
    """Lightweight project summary for list/grid views."""

    slug: str
    title: str
    tagline: str
    summary: str
    category: str
    category_label: str
    technologies: list[str]
    featured: bool
    role: str
    timeline: str
    status: str = "Completed"
    impact_metrics: list[str] | None = None
    github_url: str | None = None
    live_url: str | None = None


class ProjectNavigation(CamelModel):
    previous: ProjectListItem | None = None
    next: ProjectListItem | None = None
    related: list[ProjectListItem] = []


class ProjectDetail(ProjectListItem):
    """Full project case study including all narrative and decision fields."""

    overview: str
    problem: str
    solution: str
    architecture_diagram: str | None = None
    architecture_mermaid: str | None = None
    architecture_steps: list[ArchitectureStep] | None = None
    tech_stack_grouped: TechStackGrouped = TechStackGrouped()
    key_features: list[KeyFeature] = []
    engineering_decisions: list[EngineeringDecision] = []
    challenges: list[ProjectChallenge] = []
    security_reliability: list[SecurityReliabilityItem] = []
    results: list[str] = []
    lessons_learned: list[str] = []
    navigation: ProjectNavigation | None = None

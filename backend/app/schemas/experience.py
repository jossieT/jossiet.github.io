"""Pydantic schema for professional experience timeline entries."""

from __future__ import annotations

from app.schemas.base import CamelModel


class ExperienceItem(CamelModel):
    """A career timeline entry."""

    slug: str
    role: str
    company: str
    location: str
    period: str
    is_current: bool
    summary: str
    highlights: list[str]
    technologies: list[str]
    category: str
    sort_order: int

    model_config = {"from_attributes": True}

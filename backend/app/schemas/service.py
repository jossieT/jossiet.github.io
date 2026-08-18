"""Pydantic schema for client-facing service offerings."""

from __future__ import annotations

from app.schemas.base import CamelModel


class ServiceItem(CamelModel):
    slug: str
    title: str
    category: str
    description: str
    deliverables: list[str]
    technologies: list[str]
    icon_name: str
    sort_order: int

    model_config = {"from_attributes": True}

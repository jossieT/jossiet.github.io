"""Pydantic schemas for skill categories and individual skills."""

from __future__ import annotations

from app.schemas.base import CamelModel


class SkillItem(CamelModel):
    name: str
    level: str
    is_core: bool

    model_config = {"from_attributes": True}


class SkillCategoryDetail(CamelModel):
    slug: str
    title: str
    description: str
    icon_name: str
    skills: list[SkillItem]

    model_config = {"from_attributes": True}

"""Service layer for skill categories and skills."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import SkillCategory
from app.schemas.skill import SkillCategoryDetail


def list_skill_categories(db: Session) -> list[SkillCategoryDetail]:
    """Return all skill categories with their skills, ordered by sort_order."""
    rows = db.scalars(
        select(SkillCategory).order_by(SkillCategory.sort_order, SkillCategory.id)
    ).all()
    return [SkillCategoryDetail.model_validate(cat) for cat in rows]

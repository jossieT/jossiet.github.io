"""Service layer for professional experience timeline."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.schemas.experience import ExperienceItem


def list_experience(db: Session) -> list[ExperienceItem]:
    """Return all experience entries ordered by sort_order (newest first)."""
    rows = db.scalars(select(Experience).order_by(Experience.sort_order, Experience.id)).all()
    return [ExperienceItem.model_validate(e) for e in rows]

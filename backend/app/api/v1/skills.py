"""Skills API router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.skill import SkillCategoryDetail
from app.services import skill as skill_service
from app.services.activity import publish_activity
from app.schemas.activity import ActivityType

router = APIRouter(prefix="/skills", tags=["skills"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[SkillCategoryDetail], summary="List skill categories")
def list_skills(db: DbDep) -> list[SkillCategoryDetail]:
    """Return all skill categories with their nested skills."""
    result = skill_service.list_skill_categories(db)
    publish_activity(ActivityType.API, "Skill matrix retrieved")
    return result


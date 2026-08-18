"""Experience API router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.experience import ExperienceItem
from app.services import experience as experience_service

router = APIRouter(prefix="/experience", tags=["experience"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[ExperienceItem], summary="List experience")
def list_experience(db: DbDep) -> list[ExperienceItem]:
    """Return the full professional experience timeline ordered by sort_order."""
    return experience_service.list_experience(db)

"""Services API router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.activity import ActivityType
from app.schemas.service import ServiceItem
from app.services import service_item as service_svc
from app.services.activity import publish_activity

router = APIRouter(prefix="/services", tags=["services"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[ServiceItem], summary="List services")
def list_services(db: DbDep) -> list[ServiceItem]:
    """Return all client-facing service offerings ordered by sort_order."""
    result = service_svc.list_services(db)
    publish_activity(ActivityType.API, "Services portfolio retrieved")
    return result

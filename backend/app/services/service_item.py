"""Service layer for client-facing service offerings."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.service import Service
from app.schemas.service import ServiceItem


def list_services(db: Session) -> list[ServiceItem]:
    """Return all service offerings ordered by sort_order."""
    rows = db.scalars(
        select(Service).order_by(Service.sort_order, Service.id)
    ).all()
    return [ServiceItem.model_validate(s) for s in rows]

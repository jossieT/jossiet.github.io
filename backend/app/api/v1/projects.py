"""Projects API router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pagination import Page
from app.schemas.project import ProjectDetail, ProjectListItem
from app.services import project as project_service

router = APIRouter(prefix="/projects", tags=["projects"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("", response_model=Page[ProjectListItem], summary="List projects")
def list_projects(
    db: DbDep,
    category: Annotated[str | None, Query(description="Filter by category slug")] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 12,
) -> Page[ProjectListItem]:
    """Return a paginated list of projects, optionally filtered by category."""
    return project_service.list_projects(db, category=category, page=page, page_size=page_size)


@router.get("/featured", response_model=list[ProjectListItem], summary="Featured projects")
def featured_projects(
    db: DbDep,
    limit: Annotated[int, Query(ge=1, le=10)] = 3,
) -> list[ProjectListItem]:
    """Return the top N featured projects."""
    return project_service.get_featured_projects(db, limit=limit)


@router.get("/{slug}", response_model=ProjectDetail, summary="Project detail")
def get_project(slug: str, db: DbDep) -> ProjectDetail:
    """Return a full project case study by slug."""
    project = project_service.get_project(db, slug)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project '{slug}' not found")
    return project

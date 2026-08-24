"""Service layer for portfolio projects."""

from __future__ import annotations

import math

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.pagination import Page
from app.schemas.project import ProjectDetail, ProjectListItem, ProjectNavigation


def _list_item(project: Project) -> ProjectListItem:
    return ProjectListItem.model_validate(project)


def list_projects(
    db: Session,
    *,
    category: str | None = None,
    page: int = 1,
    page_size: int = 12,
) -> Page[ProjectListItem]:
    """Return a paginated list of projects, optionally filtered by category."""
    query = select(Project)
    if category and category != "all":
        query = query.where(Project.category == category)
    query = query.order_by(Project.sort_order, Project.id)

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    offset = (page - 1) * page_size
    rows = db.scalars(query.offset(offset).limit(page_size)).all()

    return Page(
        items=[_list_item(p) for p in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


def get_featured_projects(db: Session, *, limit: int = 3) -> list[ProjectListItem]:
    """Return the top featured projects ordered by sort_order."""
    rows = db.scalars(
        select(Project)
        .where(Project.featured.is_(True))
        .order_by(Project.sort_order, Project.id)
        .limit(limit)
    ).all()
    return [_list_item(p) for p in rows]


def get_project(db: Session, slug: str) -> ProjectDetail | None:
    """Return a full project detail by slug with computed previous/next/related navigation."""
    all_projects = db.scalars(select(Project).order_by(Project.sort_order, Project.id)).all()

    current_idx = None
    for idx, p in enumerate(all_projects):
        if p.slug == slug:
            current_idx = idx
            break

    if current_idx is None:
        return None

    row = all_projects[current_idx]

    prev_item = _list_item(all_projects[current_idx - 1]) if current_idx > 0 else None
    next_item = (
        _list_item(all_projects[current_idx + 1]) if current_idx < len(all_projects) - 1 else None
    )

    # Compute related projects
    related_items: list[ProjectListItem] = []
    if row.related_slugs:
        slug_to_item = {p.slug: _list_item(p) for p in all_projects if p.slug != slug}
        for rel_slug in row.related_slugs:
            if rel_slug in slug_to_item and len(related_items) < 3:
                related_items.append(slug_to_item[rel_slug])

    # Fallback to same category or other projects if fewer than 2 related
    if len(related_items) < 2:
        for p in all_projects:
            if p.slug != slug and p.slug not in [r.slug for r in related_items]:
                if p.category == row.category or len(related_items) == 0:
                    related_items.append(_list_item(p))
                    if len(related_items) >= 2:
                        break

    detail = ProjectDetail.model_validate(row)
    detail.navigation = ProjectNavigation(
        previous=prev_item,
        next=next_item,
        related=related_items,
    )
    return detail

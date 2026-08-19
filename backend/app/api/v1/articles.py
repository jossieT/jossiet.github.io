"""Articles API router."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.article import ArticleDetail, ArticleListItem
from app.schemas.pagination import Page
from app.services import article as article_service
from app.services.activity import publish_activity
from app.schemas.activity import ActivityType

router = APIRouter(prefix="/articles", tags=["articles"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("", response_model=Page[ArticleListItem], summary="List articles")
def list_articles(
    db: DbDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 12,
) -> Page[ArticleListItem]:
    """Return a paginated list of articles ordered by publish date descending."""
    result = article_service.list_articles(db, page=page, page_size=page_size)
    publish_activity(ActivityType.API, "Technical articles retrieved")
    return result


@router.get("/featured", response_model=list[ArticleListItem], summary="Featured articles")
def featured_articles(
    db: DbDep,
    limit: Annotated[int, Query(ge=1, le=10)] = 3,
) -> list[ArticleListItem]:
    """Return the most recent featured articles."""
    result = article_service.get_featured_articles(db, limit=limit)
    publish_activity(ActivityType.API, "Featured articles retrieved")
    return result


@router.get("/{slug}", response_model=ArticleDetail, summary="Article detail")
def get_article(slug: str, db: DbDep) -> ArticleDetail:
    """Return a full article by slug."""
    article = article_service.get_article(db, slug)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Article '{slug}' not found")
    publish_activity(ActivityType.API, "Technical article retrieved")
    return article


"""Service layer for technical articles."""

from __future__ import annotations

import math

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.article import Article
from app.schemas.article import ArticleDetail, ArticleListItem
from app.schemas.pagination import Page


def _list_item(article: Article) -> ArticleListItem:
    return ArticleListItem.model_validate(article)


def list_articles(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 12,
) -> Page[ArticleListItem]:
    """Return a paginated list of articles ordered by published_at descending."""
    query = select(Article).order_by(Article.published_at.desc(), Article.id.desc())

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    offset = (page - 1) * page_size
    rows = db.scalars(query.offset(offset).limit(page_size)).all()

    return Page(
        items=[_list_item(a) for a in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


def get_featured_articles(db: Session, *, limit: int = 3) -> list[ArticleListItem]:
    """Return the most recent featured articles."""
    rows = db.scalars(
        select(Article)
        .where(Article.featured.is_(True))
        .order_by(Article.published_at.desc())
        .limit(limit)
    ).all()
    return [_list_item(a) for a in rows]


def get_article(db: Session, slug: str) -> ArticleDetail | None:
    """Return a full article by slug, or None if not found."""
    row = db.scalar(select(Article).where(Article.slug == slug))
    if row is None:
        return None
    return ArticleDetail.model_validate(row)

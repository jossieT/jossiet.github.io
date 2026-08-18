"""Pydantic schemas for technical articles."""

from __future__ import annotations

from app.schemas.base import CamelModel


class ArticleListItem(CamelModel):
    """Lightweight article summary for list/grid views."""

    slug: str
    title: str
    excerpt: str
    published_at: str
    read_time: str
    category: str
    tags: list[str]
    featured: bool


class ArticleDetail(ArticleListItem):
    """Full article including content body."""

    content: str

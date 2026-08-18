"""Generic pagination schema used across all paginated endpoints."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import Field

from app.schemas.base import CamelModel

T = TypeVar("T")


class Page(CamelModel, Generic[T]):
    """Paginated response envelope."""

    items: list[T]
    total: int = Field(description="Total number of matching records")
    page: int = Field(ge=1, description="Current page (1-indexed)")
    page_size: int = Field(ge=1, le=100, description="Items per page")
    pages: int = Field(description="Total number of pages")

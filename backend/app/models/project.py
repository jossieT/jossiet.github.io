"""SQLAlchemy ORM model for portfolio projects / case studies."""

from datetime import UTC, datetime

from sqlalchemy import ARRAY, Boolean, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Project(Base):
    """A portfolio project / engineering case study."""

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str] = mapped_column(String(500), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    category_label: Mapped[str] = mapped_column(String(120), nullable=False)
    technologies: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    timeline: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(60), nullable=False, default="Completed")
    impact_metrics: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Long-form case study content
    overview: Mapped[str] = mapped_column(Text, nullable=False)
    problem: Mapped[str] = mapped_column(Text, nullable=False)
    solution: Mapped[str] = mapped_column(Text, nullable=False)
    architecture_diagram: Mapped[str | None] = mapped_column(Text, nullable=True)
    architecture_mermaid: Mapped[str | None] = mapped_column(Text, nullable=True)
    architecture_steps: Mapped[list | None] = mapped_column(JSONB, nullable=True)

    # Grouped technology stack {frontend: [], backend: [], database: [], infrastructure: [], ai: [], deployment: []}
    tech_stack_grouped: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Structured JSONB fields
    key_features: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    engineering_decisions: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    challenges: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    security_reliability: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    results: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    lessons_learned: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    related_slugs: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)

    sort_order: Mapped[int] = mapped_column(nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=lambda: datetime.now(UTC),
    )

    def __repr__(self) -> str:
        return f"<Project slug={self.slug!r}>"

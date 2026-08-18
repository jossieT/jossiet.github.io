"""Initial schema — creates all portfolio domain tables.

Revision ID: 0001
Revises: (none)
Create Date: 2026-08-17

Tables created:
    - projects
    - experience
    - skill_categories
    - skills
    - services
    - articles
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: str | None = None
branch_labels: str | tuple[str, ...] | None = None
depends_on: str | tuple[str, ...] | None = None


def upgrade() -> None:
    # ------------------------------------------------------------------ #
    # projects                                                            #
    # ------------------------------------------------------------------ #
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("tagline", sa.String(length=500), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("category_label", sa.String(length=120), nullable=False),
        sa.Column("technologies", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("timeline", sa.String(length=120), nullable=False),
        sa.Column("impact_metrics", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("live_url", sa.String(length=500), nullable=True),
        sa.Column("overview", sa.Text(), nullable=False),
        sa.Column("problem", sa.Text(), nullable=False),
        sa.Column("solution", sa.Text(), nullable=False),
        sa.Column("architecture_diagram", sa.Text(), nullable=True),
        sa.Column("architecture_steps", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("key_features", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("engineering_decisions", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("results", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("lessons_learned", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"])
    op.create_index("ix_projects_category", "projects", ["category"])
    op.create_index("ix_projects_featured", "projects", ["featured"])

    # ------------------------------------------------------------------ #
    # experience                                                          #
    # ------------------------------------------------------------------ #
    op.create_table(
        "experience",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("period", sa.String(length=60), nullable=False),
        sa.Column("is_current", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("highlights", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("technologies", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_experience_slug", "experience", ["slug"])

    # ------------------------------------------------------------------ #
    # skill_categories                                                    #
    # ------------------------------------------------------------------ #
    op.create_table(
        "skill_categories",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("icon_name", sa.String(length=60), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_skill_categories_slug", "skill_categories", ["slug"])

    # ------------------------------------------------------------------ #
    # skills                                                              #
    # ------------------------------------------------------------------ #
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("level", sa.String(length=30), nullable=False),
        sa.Column("is_core", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["category_id"], ["skill_categories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_skills_category_id", "skills", ["category_id"])

    # ------------------------------------------------------------------ #
    # services                                                            #
    # ------------------------------------------------------------------ #
    op.create_table(
        "services",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("deliverables", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("technologies", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("icon_name", sa.String(length=60), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_services_slug", "services", ["slug"])

    # ------------------------------------------------------------------ #
    # articles                                                            #
    # ------------------------------------------------------------------ #
    op.create_table(
        "articles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("published_at", sa.String(length=30), nullable=False),
        sa.Column("read_time", sa.String(length=30), nullable=False),
        sa.Column("category", sa.String(length=120), nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_articles_slug", "articles", ["slug"])
    op.create_index("ix_articles_category", "articles", ["category"])
    op.create_index("ix_articles_featured", "articles", ["featured"])


def downgrade() -> None:
    op.drop_table("articles")
    op.drop_table("services")
    op.drop_table("skills")
    op.drop_table("skill_categories")
    op.drop_table("experience")
    op.drop_table("projects")

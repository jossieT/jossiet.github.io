"""Add structured case study fields to projects table.

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-18

New columns on `projects`:
    - status
    - architecture_mermaid
    - tech_stack_grouped
    - challenges
    - security_reliability
    - related_slugs
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | tuple[str, ...] | None = None
depends_on: str | tuple[str, ...] | None = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("status", sa.String(60), nullable=False, server_default="Completed"),
    )
    op.add_column(
        "projects",
        sa.Column("architecture_mermaid", sa.Text(), nullable=True),
    )
    op.add_column(
        "projects",
        sa.Column("tech_stack_grouped", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="{}"),
    )
    op.add_column(
        "projects",
        sa.Column("challenges", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
    )
    op.add_column(
        "projects",
        sa.Column("security_reliability", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
    )
    op.add_column(
        "projects",
        sa.Column("related_slugs", sa.ARRAY(sa.String()), nullable=False, server_default="{}"),
    )


def downgrade() -> None:
    op.drop_column("projects", "related_slugs")
    op.drop_column("projects", "security_reliability")
    op.drop_column("projects", "challenges")
    op.drop_column("projects", "tech_stack_grouped")
    op.drop_column("projects", "architecture_mermaid")
    op.drop_column("projects", "status")

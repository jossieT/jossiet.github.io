"""SQLAlchemy ORM model for client-facing service offerings."""

from sqlalchemy import ARRAY, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Service(Base):
    """A client-facing engineering service offering."""

    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    deliverables: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    technologies: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    icon_name: Mapped[str] = mapped_column(String(60), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    def __repr__(self) -> str:
        return f"<Service slug={self.slug!r}>"

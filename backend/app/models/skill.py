"""SQLAlchemy ORM models for skill categories and individual skills."""

from sqlalchemy import ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SkillCategory(Base):
    """A grouping of related technical skills (e.g. 'AI Engineering & RAG')."""

    __tablename__ = "skill_categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon_name: Mapped[str] = mapped_column(String(60), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    skills: Mapped[list["Skill"]] = relationship(
        "Skill",
        back_populates="category",
        order_by="Skill.sort_order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<SkillCategory slug={self.slug!r}>"


class Skill(Base):
    """An individual technical skill belonging to a category."""

    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("skill_categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    level: Mapped[str] = mapped_column(String(30), nullable=False)  # Expert | Advanced | Proficient
    is_core: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    category: Mapped["SkillCategory"] = relationship("SkillCategory", back_populates="skills")

    def __repr__(self) -> str:
        return f"<Skill name={self.name!r}>"

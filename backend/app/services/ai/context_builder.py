"""Portfolio context builder.

Compiles factual public portfolio information directly from PostgreSQL into
a dense, structured text format suitable for the AI system prompt.
Caches the compiled context in memory with a configurable TTL.
"""

from __future__ import annotations

import time
import logging
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.article import Article
from app.models.experience import Experience
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill, SkillCategory

logger = logging.getLogger(__name__)

# In-memory cache
_CACHED_CONTEXT: str | None = None
_LAST_BUILD_TIME: float = 0.0


def build_portfolio_context(db: Session, force_refresh: bool = False) -> str:
    """Build or retrieve cached portfolio context."""
    global _CACHED_CONTEXT, _LAST_BUILD_TIME

    current_time = time.time()
    if (
        not force_refresh
        and _CACHED_CONTEXT is not None
        and (current_time - _LAST_BUILD_TIME) < settings.ai_context_cache_ttl
    ):
        return _CACHED_CONTEXT

    logger.info("Rebuilding AI portfolio context from PostgreSQL...")

    # Fetch projects
    projects = db.scalars(select(Project).order_by(Project.sort_order, Project.id)).all()
    
    # Fetch experience
    experience_list = db.scalars(select(Experience).order_by(Experience.sort_order, Experience.id)).all()
    
    # Fetch skill categories
    skill_categories = db.scalars(select(SkillCategory).order_by(SkillCategory.sort_order, SkillCategory.id)).all()
    skills = db.scalars(select(Skill).order_by(Skill.category_id, Skill.sort_order, Skill.id)).all()
    
    # Fetch services
    services = db.scalars(select(Service).order_by(Service.sort_order, Service.id)).all()
    
    # Fetch articles
    articles = db.scalars(select(Article).order_by(Article.id)).all()

    # Build sections
    sections: list[str] = []

    # 1. Profile / Identity Overview
    sections.append(
        "=== BIOGRAPHY & SPECIALIZATION ===\n"
        "Name: Yosef Teshome\n"
        "Title: AI Backend & Platform Engineer\n"
        "Location: Addis Ababa, Ethiopia\n"
        "Core Focus: Production RAG architectures, high-concurrency FastAPI microservices, "
        "pgvector/PostgreSQL hybrid vector search, containerized workflows (Docker, Kubernetes, OpenShift), "
        "and autonomous multi-step AI agents.\n"
        "Contact: joseteshe2017@gmail.com | Phone: +251 977 784 658 | GitHub: https://github.com/jossieT | LinkedIn: https://www.linkedin.com/in/yosef-teshome-96516b188/ | Portfolio: https://yosefteshome.dev\n"
        "Availability: Open to high-impact senior engineering roles, consulting, and contract engagements."
    )

    # 2. Skills & Competencies
    skill_cat_map: dict[int, list[str]] = {}
    for sk in skills:
        core_tag = " (Core)" if sk.is_core else ""
        skill_cat_map.setdefault(sk.category_id, []).append(f"{sk.name} [{sk.level}]{core_tag}")

    skills_lines = ["=== TECHNICAL SKILLS & EXPERTISE ==="]
    for cat in skill_categories:
        cat_skills = skill_cat_map.get(cat.id, [])
        skills_lines.append(f"• {cat.title}: {', '.join(cat_skills)}")
    sections.append("\n".join(skills_lines))

    # 3. Work Experience
    exp_lines = ["=== PROFESSIONAL EXPERIENCE ==="]
    for exp in experience_list:
        current_tag = " (Current)" if exp.is_current else ""
        exp_lines.append(
            f"• Role: {exp.role} at {exp.company} ({exp.period}){current_tag}\n"
            f"  Location: {exp.location}\n"
            f"  Summary: {exp.summary}\n"
            f"  Key Achievements: {'; '.join(exp.highlights)}\n"
            f"  Tech: {', '.join(exp.technologies)}"
        )
    sections.append("\n".join(exp_lines))

    # 4. Engineering Projects & Case Studies
    proj_lines = ["=== ENGINEERING PROJECTS & CASE STUDIES ==="]
    for p in projects:
        features_summary = "; ".join(
            [f"{f.get('title')}: {f.get('description')}" for f in (p.key_features or [])[:3]]
        )
        decisions_summary = "; ".join(
            [f"{d.get('title')}: {d.get('decision')}" for d in (p.engineering_decisions or [])[:2]]
        )
        challenges_summary = "; ".join(
            [f"{c.get('title')} (Solution: {c.get('solution')})" for c in (p.challenges or [])[:2]]
        )
        impact = "; ".join(p.impact_metrics or []) if p.impact_metrics else "N/A"

        proj_lines.append(
            f"• Project: {p.title} (slug: {p.slug})\n"
            f"  Status: {p.status} | Role: {p.role} | Category: {p.category_label}\n"
            f"  Tagline: {p.tagline}\n"
            f"  Summary: {p.summary}\n"
            f"  Technologies: {', '.join(p.technologies)}\n"
            f"  Key Impact: {impact}\n"
            f"  Architectural Overview: {p.overview}\n"
            f"  Problem: {p.problem}\n"
            f"  Solution: {p.solution}\n"
            f"  Features: {features_summary}\n"
            f"  Key Decisions: {decisions_summary}\n"
            f"  Challenges Overcome: {challenges_summary}"
        )
    sections.append("\n".join(proj_lines))

    # 5. Offered Services
    srv_lines = ["=== SERVICES OFFERED ==="]
    for s in services:
        deliverables = "; ".join(s.deliverables)
        srv_lines.append(
            f"• {s.title} ({s.category}):\n"
            f"  Description: {s.description}\n"
            f"  Deliverables: {deliverables}\n"
            f"  Tech: {', '.join(s.technologies)}"
        )
    sections.append("\n".join(srv_lines))

    # 6. Technical Articles
    art_lines = ["=== PUBLISHED TECHNICAL ARTICLES ==="]
    for a in articles:
        art_lines.append(
            f"• \"{a.title}\" (slug: {a.slug})\n"
            f"  Category: {a.category} | Read Time: {a.read_time}\n"
            f"  Summary: {a.excerpt}"
        )
    sections.append("\n".join(art_lines))

    _CACHED_CONTEXT = "\n\n".join(sections)
    _LAST_BUILD_TIME = current_time
    logger.info("AI portfolio context built successfully (%d characters).", len(_CACHED_CONTEXT))
    return _CACHED_CONTEXT

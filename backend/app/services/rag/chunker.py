"""Logical section-aware document chunking for portfolio entities."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.article import Article
from app.models.experience import Experience
from app.models.project import Project
from app.models.service import Service
from app.models.skill import Skill, SkillCategory


@dataclass
class ChunkPayload:
    """A prepared semantic chunk ready for embedding and storage."""

    doc_id: str
    chunk_index: int
    title: str
    section: str
    content: str
    content_hash: str
    source_type: str
    source_title: str
    source_url: str
    metadata_json: dict = field(default_factory=dict)


def _compute_hash(content: str) -> str:
    return hashlib.sha256(content.strip().encode("utf-8")).hexdigest()


def chunk_project(project: Project) -> list[ChunkPayload]:
    """Split a project case study into logical semantic sections."""
    chunks: list[ChunkPayload] = []
    base_url = f"/projects/{project.slug}"
    doc_prefix = f"project:{project.slug}"

    # 1. Overview & Architecture
    overview_content = (
        f"Project: {project.title}\n"
        f"Role: {project.role} | Status: {project.status} | Category: {project.category_label}\n"
        f"Tagline: {project.tagline}\n"
        f"Summary: {project.summary}\n"
        f"Technologies: {', '.join(project.technologies)}\n\n"
        f"Architectural Overview:\n{project.overview}"
    )
    if project.architecture_diagram:
        overview_content += f"\n\nArchitecture Summary: {project.architecture_diagram}"

    chunks.append(
        ChunkPayload(
            doc_id=doc_prefix,
            chunk_index=0,
            title=f"{project.title} — Overview & Architecture",
            section="Architecture",
            content=overview_content,
            content_hash=_compute_hash(overview_content),
            source_type="project",
            source_title=project.title,
            source_url=base_url,
            metadata_json={"slug": project.slug, "category": project.category, "technologies": project.technologies},
        )
    )

    # 2. Problem & Solution
    prob_sol_content = (
        f"Project: {project.title}\n\n"
        f"The Engineering Problem:\n{project.problem}\n\n"
        f"Engineered Solution:\n{project.solution}"
    )
    chunks.append(
        ChunkPayload(
            doc_id=doc_prefix,
            chunk_index=1,
            title=f"{project.title} — Problem & Solution",
            section="Problem & Solution",
            content=prob_sol_content,
            content_hash=_compute_hash(prob_sol_content),
            source_type="project",
            source_title=project.title,
            source_url=base_url,
            metadata_json={"slug": project.slug, "category": project.category},
        )
    )

    # 3. Key Features & Decisions
    features_text = "\n".join(
        [f"• {f.get('title')}: {f.get('description')}" for f in (project.key_features or [])]
    )
    decisions_text = "\n".join(
        [
            f"• Decision: {d.get('title')}\n  Context: {d.get('context')}\n  Chosen Approach: {d.get('decision')}\n  Outcome: {d.get('outcome')}"
            for d in (project.engineering_decisions or [])
        ]
    )
    feat_dec_content = (
        f"Project: {project.title}\n\n"
        f"Key Features:\n{features_text}\n\n"
        f"Engineering Decisions:\n{decisions_text}"
    )
    chunks.append(
        ChunkPayload(
            doc_id=doc_prefix,
            chunk_index=2,
            title=f"{project.title} — Key Features & Engineering Decisions",
            section="Engineering Decisions",
            content=feat_dec_content,
            content_hash=_compute_hash(feat_dec_content),
            source_type="project",
            source_title=project.title,
            source_url=base_url,
            metadata_json={"slug": project.slug},
        )
    )

    # 4. Challenges, Security & Reliability
    challenges_text = "\n".join(
        [
            f"• Challenge: {c.get('title')}\n  Obstacle: {c.get('challenge')}\n  Solution: {c.get('solution')}\n  Impact: {c.get('impact')}"
            for c in (project.challenges or [])
        ]
    )
    security_text = "\n".join(
        [f"• Security Safeguard: {s.get('title')} — {s.get('description')}" for s in (project.security_reliability or [])]
    )
    sec_content = (
        f"Project: {project.title}\n\n"
        f"Technical Challenges & Solutions:\n{challenges_text}\n\n"
        f"Security & Reliability Architecture:\n{security_text}"
    )
    chunks.append(
        ChunkPayload(
            doc_id=doc_prefix,
            chunk_index=3,
            title=f"{project.title} — Challenges & Security",
            section="Challenges & Security",
            content=sec_content,
            content_hash=_compute_hash(sec_content),
            source_type="project",
            source_title=project.title,
            source_url=base_url,
            metadata_json={"slug": project.slug},
        )
    )

    # 5. Results & Metrics
    metrics_text = "\n".join([f"• {m}" for m in (project.impact_metrics or [])])
    results_text = "\n".join([f"• {r}" for r in (project.results or [])])
    lessons_text = "\n".join([f"• {l}" for l in (project.lessons_learned or [])])
    res_content = (
        f"Project: {project.title}\n\n"
        f"Impact Metrics:\n{metrics_text}\n\n"
        f"System Outcomes & Results:\n{results_text}\n\n"
        f"Key Engineering Lessons Learned:\n{lessons_text}"
    )
    chunks.append(
        ChunkPayload(
            doc_id=doc_prefix,
            chunk_index=4,
            title=f"{project.title} — Results & Metrics",
            section="Results",
            content=res_content,
            content_hash=_compute_hash(res_content),
            source_type="project",
            source_title=project.title,
            source_url=base_url,
            metadata_json={"slug": project.slug},
        )
    )

    return chunks


def chunk_experience(exp: Experience, index: int) -> ChunkPayload:
    """Convert an experience item into a structured knowledge chunk."""
    highlights_text = "\n".join([f"• {h}" for h in exp.highlights])
    content = (
        f"Role: {exp.role} at {exp.company}\n"
        f"Period: {exp.period} | Location: {exp.location}\n"
        f"Summary: {exp.summary}\n\n"
        f"Key Engineering Contributions & Achievements:\n{highlights_text}\n\n"
        f"Technologies Utilized: {', '.join(exp.technologies)}"
    )
    return ChunkPayload(
        doc_id=f"experience:{exp.slug}",
        chunk_index=index,
        title=f"Experience — {exp.role} at {exp.company}",
        section="Work Experience",
        content=content,
        content_hash=_compute_hash(content),
        source_type="experience",
        source_title=f"{exp.role} — {exp.company}",
        source_url="/experience",
        metadata_json={"slug": exp.slug, "company": exp.company, "category": exp.category},
    )


def chunk_skills(cat: SkillCategory, skills: list[Skill], index: int) -> ChunkPayload:
    """Convert a skill category into a structured knowledge chunk."""
    skill_items = "\n".join(
        [f"• {s.name} [Proficiency: {s.level}]{' (Core Specialization)' if s.is_core else ''}" for s in skills]
    )
    content = (
        f"Skill Category: {cat.title}\n"
        f"Category Overview: {cat.description}\n\n"
        f"Specific Technologies & Competencies:\n{skill_items}"
    )
    return ChunkPayload(
        doc_id=f"skill_cat:{cat.slug}",
        chunk_index=index,
        title=f"Skills — {cat.title}",
        section="Skills & Competencies",
        content=content,
        content_hash=_compute_hash(content),
        source_type="skill",
        source_title=cat.title,
        source_url="/about",
        metadata_json={"slug": cat.slug},
    )


def chunk_service(srv: Service, index: int) -> ChunkPayload:
    """Convert a service offering into a structured knowledge chunk."""
    deliverables_text = "\n".join([f"• {d}" for d in srv.deliverables])
    content = (
        f"Service Offering: {srv.title}\n"
        f"Category: {srv.category}\n"
        f"Description: {srv.description}\n\n"
        f"Key Deliverables:\n{deliverables_text}\n\n"
        f"Core Technologies: {', '.join(srv.technologies)}"
    )
    return ChunkPayload(
        doc_id=f"service:{srv.slug}",
        chunk_index=index,
        title=f"Services — {srv.title}",
        section="Services & Consulting",
        content=content,
        content_hash=_compute_hash(content),
        source_type="service",
        source_title=srv.title,
        source_url="/services",
        metadata_json={"slug": srv.slug, "category": srv.category},
    )


def chunk_article(art: Article, index: int) -> ChunkPayload:
    """Convert a technical article into a structured knowledge chunk."""
    content = (
        f"Article Title: {art.title}\n"
        f"Published: {art.published_at} | Read Time: {art.read_time} | Category: {art.category}\n"
        f"Tags: {', '.join(art.tags)}\n\n"
        f"Executive Summary:\n{art.excerpt}\n\n"
        f"Article Content:\n{art.content}"
    )
    return ChunkPayload(
        doc_id=f"article:{art.slug}",
        chunk_index=index,
        title=f"Article — {art.title}",
        section="Technical Articles",
        content=content,
        content_hash=_compute_hash(content),
        source_type="article",
        source_title=art.title,
        source_url=f"/articles/{art.slug}",
        metadata_json={"slug": art.slug, "category": art.category},
    )


def chunk_biography() -> ChunkPayload:
    """Create a profile & contact biography chunk."""
    content = (
        "Name: Yosef Teshome\n"
        "Professional Title: AI Backend & Platform Engineer\n"
        "Location: Addis Ababa, Ethiopia\n"
        "Core Focus & Value Proposition: Specializes in production RAG systems, FastAPI microservices, "
        "PostgreSQL 17 with pgvector vector search, Docker, Kubernetes, OpenShift, Redis, and autonomous AI agents.\n"
        "Availability: Available for senior backend / AI engineering roles, technical consulting, and contract projects.\n"
        "Contact Information:\n"
        "• Email: joseteshe2017@gmail.com\n"
        "• Phone: +251 977 784 658\n"
        "• GitHub: https://github.com/jossieTand\n"
        "• Portfolio Website: https://yosefteshome.dev\n"
    )
    return ChunkPayload(
        doc_id="bio:yosef-teshome",
        chunk_index=0,
        title="Yosef Teshome — Profile, Biography & Contact",
        section="Biography & Contact",
        content=content,
        content_hash=_compute_hash(content),
        source_type="biography",
        source_title="Yosef Teshome — Profile & Contact",
        source_url="/contact",
        metadata_json={},
    )


def generate_all_chunks(db: Session) -> list[ChunkPayload]:
    """Extract and logically chunk all portfolio entities from PostgreSQL."""
    all_chunks: list[ChunkPayload] = []

    # 1. Profile / Biography
    all_chunks.append(chunk_biography())

    # 2. Projects
    projects = db.scalars(select(Project).order_by(Project.sort_order, Project.id)).all()
    for p in projects:
        all_chunks.extend(chunk_project(p))

    # 3. Experience
    experience_list = db.scalars(select(Experience).order_by(Experience.sort_order, Experience.id)).all()
    for idx, exp in enumerate(experience_list):
        all_chunks.append(chunk_experience(exp, idx))

    # 4. Skills
    skill_categories = db.scalars(select(SkillCategory).order_by(SkillCategory.sort_order, SkillCategory.id)).all()
    for idx, cat in enumerate(skill_categories):
        skills = db.scalars(select(Skill).where(Skill.category_id == cat.id).order_by(Skill.sort_order, Skill.id)).all()
        all_chunks.append(chunk_skills(cat, list(skills), idx))

    # 5. Services
    services = db.scalars(select(Service).order_by(Service.sort_order, Service.id)).all()
    for idx, srv in enumerate(services):
        all_chunks.append(chunk_service(srv, idx))

    # 6. Articles
    articles = db.scalars(select(Article).order_by(Article.id)).all()
    for idx, art in enumerate(articles):
        all_chunks.append(chunk_article(art, idx))

    return all_chunks

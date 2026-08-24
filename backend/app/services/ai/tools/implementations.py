"""Safe implementations of AI Agent Tools querying PostgreSQL models and pgvector."""

from __future__ import annotations

import logging

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.experience import Experience
from app.models.project import Project
from app.models.service import Service
from app.services.ai.tools.schemas import (
    ArticleItemOutput,
    ContactOutput,
    ExperienceItemOutput,
    FindByTechnologyInput,
    FindByTechnologyOutput,
    GetContactInput,
    GetExperienceInput,
    GetExperienceOutput,
    GetProjectInput,
    GetServicesInput,
    GetServicesOutput,
    KnowledgeChunkOutput,
    ProjectDetailOutput,
    ProjectItemSummary,
    SearchArticlesInput,
    SearchArticlesOutput,
    SearchKnowledgeRagInput,
    SearchKnowledgeRagOutput,
    SearchProjectsInput,
    SearchProjectsOutput,
    ServiceItemOutput,
)
from app.services.rag.retriever import retrieve_relevant_chunks

logger = logging.getLogger(__name__)


# ─── Tool 1: search_projects ──────────────────────────────────────────────────


def search_projects(db: Session, args: SearchProjectsInput) -> SearchProjectsOutput:
    """Search portfolio projects by query keyword, category, or technology."""
    query = select(Project).order_by(Project.sort_order, Project.id)

    if args.category and args.category.strip():
        cat_lower = args.category.strip().lower()
        if cat_lower != "all":
            query = query.where(func.lower(Project.category) == cat_lower)

    projects = list(db.scalars(query).all())

    # In-memory keyword and technology filtering
    filtered: list[Project] = []
    q_lower = args.query.lower().strip() if args.query else None
    tech_lower = args.technology.lower().strip() if args.technology else None

    for p in projects:
        matches = True
        if q_lower:
            searchable = (
                f"{p.title} {p.summary} {p.category} {' '.join(p.technologies or [])}".lower()
            )
            if q_lower not in searchable:
                matches = False
        if tech_lower and matches:
            techs = [t.lower() for t in (p.technologies or [])]
            if not any(tech_lower in t for t in techs):
                matches = False
        if matches:
            filtered.append(p)

    results = [
        ProjectItemSummary(
            slug=p.slug,
            title=p.title,
            summary=p.summary,
            category=p.category,
            technologies=p.technologies or [],
            featured=p.featured,
            url=f"/projects/{p.slug}",
        )
        for p in filtered[: args.limit]
    ]

    return SearchProjectsOutput(total=len(results), projects=results)


# ─── Tool 2: get_project ──────────────────────────────────────────────────────


def get_project(db: Session, args: GetProjectInput) -> ProjectDetailOutput:
    """Retrieve full technical case study for a single project by slug."""
    slug_clean = args.slug.strip().lower()
    project = db.scalars(select(Project).where(func.lower(Project.slug) == slug_clean)).first()

    if not project:
        # Try matching title or prefix
        project = db.scalars(
            select(Project).where(func.lower(Project.title).contains(slug_clean))
        ).first()

    if not project:
        return ProjectDetailOutput(found=False)

    # Format key features, engineering decisions, challenges
    key_features = [
        f"{f.get('title', '')}: {f.get('description', '')}" if isinstance(f, dict) else str(f)
        for f in (project.key_features or [])
    ]
    decisions = [
        f"{d.get('decision', '')} — Rationale: {d.get('rationale', '')}"
        if isinstance(d, dict)
        else str(d)
        for d in (project.engineering_decisions or [])
    ]
    challenges = [
        f"Challenge: {c.get('challenge', '')} -> Solution: {c.get('solution', '')}"
        if isinstance(c, dict)
        else str(c)
        for c in (project.challenges or [])
    ]

    return ProjectDetailOutput(
        found=True,
        slug=project.slug,
        title=project.title,
        summary=project.summary,
        category=project.category,
        technologies=project.technologies or [],
        github_url=project.github_url,
        live_url=project.live_url,
        overview=project.overview,
        problem_statement=project.problem,
        solution_overview=project.solution,
        key_features=key_features,
        engineering_decisions=decisions,
        challenges_and_solutions=challenges,
        metrics=project.results or [],
        architecture_overview=[],
        url=f"/projects/{project.slug}",
    )


# ─── Tool 3: find_projects_by_technology ──────────────────────────────────────


def find_projects_by_technology(db: Session, args: FindByTechnologyInput) -> FindByTechnologyOutput:
    """Find all projects built using a given technology."""
    tech_query = args.technology.strip().lower()
    projects = list(db.scalars(select(Project).order_by(Project.sort_order, Project.id)).all())

    matched: list[ProjectItemSummary] = []
    for p in projects:
        tech_list = [t.lower() for t in (p.technologies or [])]
        if any(tech_query in t for t in tech_list):
            matched.append(
                ProjectItemSummary(
                    slug=p.slug,
                    title=p.title,
                    summary=p.summary,
                    category=p.category,
                    technologies=p.technologies or [],
                    featured=p.featured,
                    url=f"/projects/{p.slug}",
                )
            )

    return FindByTechnologyOutput(
        technology=args.technology,
        total=len(matched[: args.limit]),
        projects=matched[: args.limit],
    )


# ─── Tool 4: get_experience ───────────────────────────────────────────────────


def get_experience(db: Session, args: GetExperienceInput) -> GetExperienceOutput:
    """Retrieve Yosef's professional roles and work history."""
    items = list(
        db.scalars(select(Experience).order_by(Experience.sort_order, Experience.id)).all()
    )

    filtered: list[ExperienceItemOutput] = []
    tech_filter = args.technology.lower().strip() if args.technology else None
    role_filter = args.role.lower().strip() if args.role else None
    org_filter = args.organization.lower().strip() if args.organization else None

    for exp in items:
        matches = True
        if tech_filter:
            techs = [t.lower() for t in (exp.technologies or [])]
            if not any(tech_filter in t for t in techs):
                matches = False
        if role_filter and matches:
            if role_filter not in exp.role.lower():
                matches = False
        if org_filter and matches:
            if org_filter not in exp.company.lower():
                matches = False
        if matches:
            filtered.append(
                ExperienceItemOutput(
                    role=exp.role,
                    company=exp.company,
                    location=exp.location or "",
                    period=exp.period,
                    description=exp.summary,
                    highlights=exp.highlights or [],
                    technologies=exp.technologies or [],
                    url="/experience",
                )
            )

    return GetExperienceOutput(total=len(filtered), items=filtered)


# ─── Tool 5: get_services ─────────────────────────────────────────────────────


def get_services(db: Session, args: GetServicesInput) -> GetServicesOutput:
    """Retrieve Yosef's engineering and consulting services."""
    query = select(Service).order_by(Service.sort_order, Service.id)
    if args.category and args.category.strip().lower() != "all":
        query = query.where(func.lower(Service.category) == args.category.strip().lower())

    services = list(db.scalars(query).all())
    results = [
        ServiceItemOutput(
            slug=s.slug,
            title=s.title,
            category=s.category,
            description=s.description,
            deliverables=s.deliverables or [],
            technologies=s.technologies or [],
            url="/services",
        )
        for s in services
    ]
    return GetServicesOutput(total=len(results), services=results)


# ─── Tool 6: search_articles ──────────────────────────────────────────────────


def search_articles(db: Session, args: SearchArticlesInput) -> SearchArticlesOutput:
    """Search published technical articles and thought leadership."""
    articles = list(db.scalars(select(Article).order_by(Article.id)).all())

    q_lower = args.query.lower().strip() if args.query else None
    filtered: list[ArticleItemOutput] = []

    for a in articles:
        if q_lower:
            searchable = f"{a.title} {a.excerpt} {' '.join(a.tags or [])}".lower()
            if q_lower not in searchable:
                continue
        filtered.append(
            ArticleItemOutput(
                slug=a.slug,
                title=a.title,
                summary=a.excerpt,
                tags=a.tags or [],
                reading_time=a.read_time,
                published_date=a.published_at,
                url=f"/articles/{a.slug}",
            )
        )

    return SearchArticlesOutput(
        total=len(filtered[: args.limit]),
        articles=filtered[: args.limit],
    )


# ─── Tool 7: get_contact_information ──────────────────────────────────────────


def get_contact_information(db: Session, args: GetContactInput) -> ContactOutput:
    """Return only intentionally public contact information."""
    return ContactOutput()


# ─── Tool 8: search_knowledge_rag ────────────────────────────────────────────


def search_knowledge_rag(db: Session, args: SearchKnowledgeRagInput) -> SearchKnowledgeRagOutput:
    """Perform semantic cosine retrieval across portfolio knowledge chunks."""
    retrieved = retrieve_relevant_chunks(db, args.query, top_k=args.top_k)
    chunks = [
        KnowledgeChunkOutput(
            title=c.title,
            section=c.section,
            content=c.content,
            source_type=c.source_type,
            source_title=c.source_title,
            source_url=c.source_url,
            similarity=round(c.similarity, 4),
        )
        for c in retrieved
    ]
    return SearchKnowledgeRagOutput(
        query=args.query,
        total_found=len(chunks),
        chunks=chunks,
    )

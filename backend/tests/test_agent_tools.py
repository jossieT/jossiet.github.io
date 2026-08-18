"""Unit tests for AI Agent Tools and ToolRegistry."""

import pytest
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.ai.tools.implementations import (
    find_projects_by_technology,
    get_contact_information,
    get_experience,
    get_project,
    get_services,
    search_articles,
    search_knowledge_rag,
    search_projects,
)
from app.services.ai.tools.registry import ToolRegistry, get_tool_registry
from app.services.ai.tools.schemas import (
    FindByTechnologyInput,
    GetContactInput,
    GetExperienceInput,
    GetProjectInput,
    GetServicesInput,
    SearchArticlesInput,
    SearchKnowledgeRagInput,
    SearchProjectsInput,
)


def test_tool_registry_contains_all_default_tools() -> None:
    """Registry registers all 8 tools and exports valid OpenAI schemas."""
    registry = get_tool_registry()
    tools = registry.list_tools()
    names = {t.name for t in tools}

    expected = {
        "search_projects",
        "get_project",
        "find_projects_by_technology",
        "get_experience",
        "get_services",
        "search_articles",
        "get_contact_information",
        "search_knowledge_rag",
    }
    assert expected.issubset(names)

    schemas = registry.get_openai_tools_schema()
    assert len(schemas) == len(tools)
    for s in schemas:
        assert s["type"] == "function"
        assert "name" in s["function"]
        assert "description" in s["function"]
        assert "parameters" in s["function"]


def test_search_projects_tool() -> None:
    """search_projects filters projects by keyword or category."""
    with SessionLocal() as db:
        res = search_projects(db, SearchProjectsInput(query="RAG", limit=3))
        assert res.total >= 1
        assert any("RAG" in p.title or "rag" in p.slug for p in res.projects)


def test_get_project_tool() -> None:
    """get_project returns case study details for existing project."""
    with SessionLocal() as db:
        res = get_project(db, GetProjectInput(slug="enterprise-ai-knowledge-platform"))
        assert res.found is True
        assert res.title == "Enterprise AI Knowledge Platform (RAG)"
        assert len(res.technologies) > 0
        assert len(res.engineering_decisions) > 0


def test_find_projects_by_technology_tool() -> None:
    """find_projects_by_technology finds projects utilizing PostgreSQL."""
    with SessionLocal() as db:
        res = find_projects_by_technology(db, FindByTechnologyInput(technology="PostgreSQL"))
        assert res.total >= 1
        for p in res.projects:
            assert any("postgres" in t.lower() for t in p.technologies)


def test_get_experience_tool() -> None:
    """get_experience retrieves work history with roles and highlights."""
    with SessionLocal() as db:
        res = get_experience(db, GetExperienceInput())
        assert res.total >= 2
        first = res.items[0]
        assert first.role
        assert first.company
        assert len(first.highlights) > 0


def test_get_services_tool() -> None:
    """get_services retrieves consulting and engineering offerings."""
    with SessionLocal() as db:
        res = get_services(db, GetServicesInput())
        assert res.total >= 3
        for s in res.services:
            assert s.title
            assert len(s.deliverables) > 0


def test_search_articles_tool() -> None:
    """search_articles searches published thought leadership."""
    with SessionLocal() as db:
        res = search_articles(db, SearchArticlesInput(query="FastAPI"))
        assert res.total >= 1
        assert any("fastapi" in a.slug.lower() or "fastapi" in a.title.lower() for a in res.articles)


def test_get_contact_information_tool() -> None:
    """get_contact_information returns verified public contact details."""
    with SessionLocal() as db:
        res = get_contact_information(db, GetContactInput())
        assert res.email == "joseteshe2017@gmail.com"
        assert "github.com/jossieT" in res.github
        assert res.availability


def test_search_knowledge_rag_tool() -> None:
    """search_knowledge_rag performs semantic retrieval over knowledge chunks."""
    with SessionLocal() as db:
        res = search_knowledge_rag(db, SearchKnowledgeRagInput(query="HNSW indexing", top_k=2))
        assert isinstance(res.chunks, list)


@pytest.mark.anyio
async def test_tool_registry_safe_execution_and_unknown_tool() -> None:
    """Registry safely handles unknown tools and invalid argument formats."""
    registry = ToolRegistry()
    with SessionLocal() as db:
        # Unknown tool
        res_unknown = await registry.execute("non_existent_tool", {}, db)
        assert res_unknown.success is False
        assert "not recognized" in res_unknown.error

        # Invalid arguments
        res_invalid = await registry.execute("get_project", {"slug": None}, db)
        assert res_invalid.success is False
        assert "Invalid arguments" in res_invalid.error

        # Valid execution
        res_valid = await registry.execute(
            "find_projects_by_technology",
            {"technology": "FastAPI", "limit": 2},
            db,
        )
        assert res_valid.success is True
        assert res_valid.data["total"] >= 1
        assert len(res_valid.sources) >= 1

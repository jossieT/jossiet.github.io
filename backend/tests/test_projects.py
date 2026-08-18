"""Tests for the projects API endpoints."""

from fastapi.testclient import TestClient
from app.core.config import settings


def test_list_projects(client: TestClient) -> None:
    """GET /projects returns a paginated list."""
    response = client.get(f"{settings.api_v1_prefix}/projects")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) > 0
    first = data["items"][0]
    assert "slug" in first
    assert "title" in first
    assert "status" in first


def test_featured_projects(client: TestClient) -> None:
    """GET /projects/featured returns featured projects."""
    response = client.get(f"{settings.api_v1_prefix}/projects/featured")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(p["featured"] is True for p in data)


def test_get_project_detail_with_case_study(client: TestClient) -> None:
    """GET /projects/{slug} returns complete case study data with navigation."""
    response = client.get(f"{settings.api_v1_prefix}/projects/enterprise-ai-knowledge-platform")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "enterprise-ai-knowledge-platform"
    assert data["status"] == "In Production"
    assert "architectureMermaid" in data
    assert "techStackGrouped" in data
    assert "challenges" in data
    assert "securityReliability" in data
    assert "navigation" in data
    assert "related" in data["navigation"]


def test_get_project_404(client: TestClient) -> None:
    """GET /projects/{slug} returns 404 for missing project."""
    response = client.get(f"{settings.api_v1_prefix}/projects/non-existent-slug")
    assert response.status_code == 404

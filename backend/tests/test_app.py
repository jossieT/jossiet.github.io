"""Tests for application startup and route registration."""

from fastapi.testclient import TestClient


def test_app_starts_and_docs_available(client: TestClient) -> None:
    """The application initializes and exposes interactive documentation."""
    response = client.get("/docs")

    assert response.status_code == 200


def test_app_exposes_redoc(client: TestClient) -> None:
    """ReDoc documentation is available."""
    response = client.get("/redoc")

    assert response.status_code == 200


def test_app_exposes_health_readiness_route(client: TestClient) -> None:
    """The v1 readiness route is registered and responds."""
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] in {"ok", "degraded"}

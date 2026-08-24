"""Tests for the health endpoint."""

from fastapi.testclient import TestClient


def test_health_returns_200_and_expected_shape(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload == {"status": "ok", "service": "Yosef Portfolio API"}


def test_system_status_returns_valid_structure(client: TestClient) -> None:
    response = client.get("/api/v1/health/status")
    assert response.status_code == 200
    payload = response.json()
    assert "status" in payload
    assert "services" in payload
    assert "api" in payload["services"]
    assert "database" in payload["services"]
    assert "redis" in payload["services"]
    assert "ai" in payload["services"]
    assert "sse" in payload["services"]

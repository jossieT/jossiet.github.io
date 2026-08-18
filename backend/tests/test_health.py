"""Tests for the health endpoint."""

from fastapi.testclient import TestClient


def test_health_returns_200_and_expected_shape(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload == {"status": "ok", "service": "Yosef Portfolio API"}

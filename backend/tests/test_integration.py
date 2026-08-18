"""Integration tests requiring running infrastructure (Docker Compose).

These tests verify real connectivity to PostgreSQL and Redis. They are skipped
by default: run them with ``RUN_INTEGRATION=1 pytest`` once the infrastructure
is up via ``docker compose up -d``.
"""

import os

import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.services import health

RUN_INTEGRATION = os.environ.get("RUN_INTEGRATION") == "1"


@pytest.mark.skipif(
    not RUN_INTEGRATION,
    reason="Requires docker compose up -d and RUN_INTEGRATION=1",
)
def test_database_connectivity() -> None:
    """The backend can reach PostgreSQL."""
    status = health.check_database()

    assert status.status == "ok", status.detail


@pytest.mark.skipif(
    not RUN_INTEGRATION,
    reason="Requires docker compose up -d and RUN_INTEGRATION=1",
)
def test_redis_connectivity() -> None:
    """The backend can reach Redis."""
    status = health.check_redis()

    assert status.status == "ok", status.detail


@pytest.mark.skipif(
    not RUN_INTEGRATION,
    reason="Requires docker compose up -d and RUN_INTEGRATION=1",
)
def test_readiness_endpoint_reports_ok(client: TestClient) -> None:
    """The readiness endpoint reports ok when infrastructure is up."""
    response = client.get(f"{settings.api_v1_prefix}/health/ready")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["database"]["status"] == "ok"
    assert payload["redis"]["status"] == "ok"

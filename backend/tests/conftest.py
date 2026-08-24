"""Shared pytest fixtures and environment setup.

Required environment variables are set before any application import so that
settings resolve deterministically. Infra-backed tests are gated behind an
env flag so the suite passes without Docker running.
"""

import os

# Must be set before importing the application.
os.environ.setdefault(
    "DATABASE_URL", "postgresql+psycopg://yosef:yosef_dev_password@localhost:5433/yosef_portfolio"
)
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("DEBUG", "false")

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    """TestClient for the FastAPI application."""
    return TestClient(app)


@pytest.fixture(scope="session")
def run_integration() -> bool:
    """Whether Docker-backed connectivity tests should run."""
    return os.environ.get("RUN_INTEGRATION", "0") == "1"

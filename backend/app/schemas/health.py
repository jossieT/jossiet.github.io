"""Health check response schemas."""

from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Liveness response: the service is running."""

    status: Literal["ok"]
    service: str


class DependencyStatus(BaseModel):
    """Readiness status for a single infrastructure dependency."""

    status: Literal["ok", "unavailable"]
    detail: str | None = None


class ReadinessResponse(BaseModel):
    """Readiness response: whether core dependencies are reachable."""

    status: Literal["ok", "degraded"]
    database: DependencyStatus
    redis: DependencyStatus

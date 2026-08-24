"""Health check response schemas."""

from datetime import datetime
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


class ServiceStatusItem(BaseModel):
    """Public status for an individual application service/component."""

    status: Literal["up", "ready", "degraded", "down", "unavailable"]
    latency_ms: float | None = None


class ServicesStatusDict(BaseModel):
    """Collection of public service status items."""

    api: ServiceStatusItem
    database: ServiceStatusItem
    redis: ServiceStatusItem
    ai: ServiceStatusItem
    sse: ServiceStatusItem


class SystemStatusResponse(BaseModel):
    """Detailed public system status response."""

    status: Literal["healthy", "degraded", "down"]
    services: ServicesStatusDict
    timestamp: datetime

"""API v1 route definitions."""

from fastapi import APIRouter

from app.api.v1 import activity, articles, chat, experience, projects, services, skills
from app.core.config import settings
from app.schemas.health import HealthResponse, ReadinessResponse, SystemStatusResponse
from app.services.health import get_readiness, get_system_status

api_router = APIRouter()


@api_router.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    """Liveness probe: the API process is running."""
    return HealthResponse(status="ok", service=settings.app_name)


@api_router.get("/health/ready", response_model=ReadinessResponse, tags=["health"])
def readiness() -> ReadinessResponse:
    """Readiness probe: core dependencies (database, Redis) are reachable."""
    return get_readiness()


@api_router.get("/health/status", response_model=SystemStatusResponse, tags=["health"])
def system_status() -> SystemStatusResponse:
    """Detailed public system status for application components and dependencies."""
    return get_system_status()


# Domain routers
api_router.include_router(projects.router)
api_router.include_router(experience.router)
api_router.include_router(skills.router)
api_router.include_router(services.router)
api_router.include_router(articles.router)
api_router.include_router(chat.router)
api_router.include_router(activity.router)

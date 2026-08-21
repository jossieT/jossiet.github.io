"""Readiness checks for core infrastructure dependencies."""

import logging

import time
from datetime import datetime, timezone

import redis as redis_lib
from redis.exceptions import RedisError
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.db.session import engine
from app.schemas.health import (
    DependencyStatus,
    ReadinessResponse,
    ServiceStatusItem,
    ServicesStatusDict,
    SystemStatusResponse,
)
from app.services.activity import publish_activity
from app.schemas.activity import ActivityType

logger = logging.getLogger(__name__)


def check_database() -> DependencyStatus:
    """Verify the database is reachable by running a trivial query."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return DependencyStatus(status="ok")
    except SQLAlchemyError as exc:
        logger.warning("Database readiness check failed: %s", exc)
        return DependencyStatus(status="unavailable", detail=str(exc))


def check_redis() -> DependencyStatus:
    """Verify Redis is reachable by issuing a PING command."""
    try:
        client = redis_lib.Redis.from_url(settings.redis_url, socket_connect_timeout=3)
        client.ping()
        return DependencyStatus(status="ok")
    except RedisError as exc:
        logger.warning("Redis readiness check failed: %s", exc)
        return DependencyStatus(status="unavailable", detail=str(exc))


def get_readiness() -> ReadinessResponse:
    """Return overall readiness based on database and Redis status."""
    database = check_database()
    redis = check_redis()

    overall = "ok" if (database.status == "ok" and redis.status == "ok") else "degraded"
    publish_activity(
        ActivityType.SYSTEM,
        f"System health check: {overall}",
        status="success" if overall == "ok" else "error",
    )
    return ReadinessResponse(status=overall, database=database, redis=redis)


def get_system_status() -> SystemStatusResponse:
    """Return detailed public health status for all system services."""
    start_time = time.perf_counter()

    db_dep = check_database()
    db_status = "up" if db_dep.status == "ok" else "down"

    redis_dep = check_redis()
    redis_status = "up" if redis_dep.status == "ok" else "down"

    ai_status = "ready" if settings.ai_enabled else "unavailable"
    sse_status = "up"

    api_latency_ms = round((time.perf_counter() - start_time) * 1000.0, 1)

    services = ServicesStatusDict(
        api=ServiceStatusItem(status="up", latency_ms=api_latency_ms),
        database=ServiceStatusItem(status=db_status),
        redis=ServiceStatusItem(status=redis_status),
        ai=ServiceStatusItem(status=ai_status),
        sse=ServiceStatusItem(status=sse_status),
    )

    if db_status == "up" and redis_status == "up" and ai_status == "ready":
        overall = "healthy"
    elif db_status == "down" and redis_status == "down":
        overall = "down"
    else:
        overall = "degraded"

    return SystemStatusResponse(
        status=overall,
        services=services,
        timestamp=datetime.now(timezone.utc),
    )



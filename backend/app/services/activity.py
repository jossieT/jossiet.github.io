"""Bounded, sanitized public activity events backed by existing Redis."""

from __future__ import annotations

import asyncio
import logging
from collections import deque
from datetime import UTC, datetime

import redis

from app.core.config import settings
from app.schemas.activity import ActivityType, PublicActivityEvent

logger = logging.getLogger(__name__)
_HISTORY_KEY = "public_activity:history"
_CHANNEL = "public_activity:stream"
_HISTORY_LIMIT = 30
_memory_history: deque[PublicActivityEvent] = deque(maxlen=_HISTORY_LIMIT)

_subscribers: set[asyncio.Queue[PublicActivityEvent]] = set()


def publish_activity(
    event_type: ActivityType,
    message: str,
    *,
    status: str = "success",
    duration_ms: int | None = None,
) -> PublicActivityEvent:
    """Publish only application-authored, concise public status events."""
    event = PublicActivityEvent(
        type=event_type,
        message=message,
        status=status,
        timestamp=datetime.now(UTC),
        duration_ms=round(duration_ms) if duration_ms is not None else None,
    )
    _memory_history.append(event)
    payload = event.model_dump_json()
    try:
        client = redis.from_url(
            settings.redis_url, decode_responses=True, socket_connect_timeout=0.2
        )
        client.lpush(_HISTORY_KEY, payload)
        client.ltrim(_HISTORY_KEY, 0, _HISTORY_LIMIT - 1)
        client.publish(_CHANNEL, payload)
        client.close()
    except Exception:
        logger.debug("Public activity Redis publish unavailable", exc_info=True)
    for queue in tuple(_subscribers):
        if not queue.full():
            queue.put_nowait(event)
    return event


def recent_activity() -> list[PublicActivityEvent]:
    try:
        client = redis.from_url(
            settings.redis_url, decode_responses=True, socket_connect_timeout=0.2
        )
        entries = client.lrange(_HISTORY_KEY, 0, _HISTORY_LIMIT - 1)
        client.close()
        if entries:
            return [PublicActivityEvent.model_validate_json(entry) for entry in reversed(entries)]
    except Exception:
        pass
    return list(_memory_history)


async def stream_activity():
    """Yield bounded history, live local events, and SSE keepalives safely."""
    # Yield initial SSE header comment immediately to force HTTP 200 header flush
    yield ": connected\n\n"
    queue: asyncio.Queue[PublicActivityEvent] = asyncio.Queue(maxsize=16)
    _subscribers.add(queue)
    try:
        for event in recent_activity():
            yield f"data: {event.model_dump_json()}\n\n"
        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=15)
                yield f"data: {event.model_dump_json()}\n\n"
            except TimeoutError:
                yield ": keepalive\n\n"
    finally:
        _subscribers.discard(queue)

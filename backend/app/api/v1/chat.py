"""AI Chat endpoint supporting SSE streaming and Redis rate limiting."""

from __future__ import annotations

import logging
from typing import Annotated

import redis
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.activity import ActivityType
from app.schemas.chat import ChatRequest
from app.services.activity import publish_activity
from app.services.ai.chat_service import stream_chat_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

DbDep = Annotated[Session, Depends(get_db)]

# Redis client for rate limiting
_redis_client: redis.Redis | None = None


def get_redis() -> redis.Redis | None:
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = redis.from_url(settings.redis_url, decode_responses=True)
        except Exception as e:
            logger.warning("Could not connect to Redis for chat rate limiting: %s", e)
            return None
    return _redis_client


def check_rate_limit(request: Request) -> None:
    """Check anonymous IP rate limit using Redis sliding window counter."""
    client_ip = request.client.host if request.client else "unknown"

    # Check X-Forwarded-For header if behind a reverse proxy
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    r = get_redis()
    if r is None:
        return  # Fail open if Redis unavailable

    key = f"ratelimit:chat:{client_ip}"
    try:
        current_count = r.incr(key)
        if current_count == 1:
            r.expire(key, 3600)  # 1 hour window

        if current_count > settings.ai_rate_limit_per_hour:
            logger.warning("Rate limit exceeded for IP %s (count: %d)", client_ip, current_count)
            publish_activity(
                ActivityType.CACHE, "Redis rate limit threshold reached", status="error"
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please wait a bit before sending more messages.",
            )
        publish_activity(ActivityType.CACHE, "Redis rate limit check passed")
    except HTTPException:
        raise
    except Exception as e:
        logger.warning("Redis rate limit check error: %s", e)
        return  # Fail open on unexpected redis error


@router.post(
    "",
    summary="Send a message to the AI Portfolio Concierge",
    response_description="Server-Sent Events (SSE) streaming tokens",
)
async def chat(
    request: Request,
    body: ChatRequest,
    db: DbDep,
) -> StreamingResponse:
    """Stream response from the AI Portfolio Concierge with context injection."""
    # Check rate limit
    check_rate_limit(request)

    # Validate latest message length
    latest_msg = body.messages[-1]
    if len(latest_msg.content) > settings.ai_max_input_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Message exceeds maximum allowed length of {settings.ai_max_input_length} characters.",
        )

    # Stream SSE response
    return StreamingResponse(
        stream_chat_response(body.messages, db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

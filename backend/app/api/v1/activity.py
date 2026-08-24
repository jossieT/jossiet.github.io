"""Public Server-Sent Events for sanitized application activity."""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.activity import ActivityType
from app.services.activity import publish_activity, stream_activity

router = APIRouter(prefix="/activity", tags=["activity"])


@router.get("/stream", summary="Public-safe application activity stream")
async def activity_stream() -> StreamingResponse:
    publish_activity(ActivityType.SSE, "Activity stream connected", status="info")
    return StreamingResponse(
        stream_activity(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

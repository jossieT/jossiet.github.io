"""Public-safe application activity payloads for the hero topology."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class ActivityType(str, Enum):
    API = "api"
    RAG = "rag"
    AGENT = "agent"
    DB = "db"
    CACHE = "cache"
    SSE = "sse"
    SYSTEM = "system"


class PublicActivityEvent(BaseModel):
    type: ActivityType
    message: str = Field(min_length=1, max_length=96)
    status: str = Field(default="success", pattern="^(success|info|error)$")
    timestamp: datetime
    duration_ms: int | None = Field(default=None, ge=0, le=60_000)

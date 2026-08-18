"""Pydantic schemas for the AI portfolio assistant."""

from __future__ import annotations

from typing import Literal
from pydantic import Field, field_validator

from app.schemas.base import CamelModel


class ChatMessage(CamelModel):
    """A single message in a conversation."""

    role: Literal["user", "assistant", "system"]
    content: str = Field(..., min_length=1, max_length=4000)

    @field_validator("content")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message content cannot be empty or whitespace only.")
        return stripped


class ChatRequest(CamelModel):
    """Incoming chat request from the frontend."""

    messages: list[ChatMessage] = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Conversation history leading up to and including the latest user prompt.",
    )

    @field_validator("messages")
    @classmethod
    def validate_last_message(cls, v: list[ChatMessage]) -> list[ChatMessage]:
        if not v:
            raise ValueError("Messages list cannot be empty.")
        if v[-1].role != "user":
            raise ValueError("The final message in the conversation must be from the user.")
        return v


class ChatResponse(CamelModel):
    """Non-streaming JSON fallback response."""

    message: ChatMessage

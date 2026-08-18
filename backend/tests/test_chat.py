"""Tests for the AI Chat endpoint, context builder, and service."""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.services.ai.context_builder import build_portfolio_context


def test_context_builder_generates_valid_portfolio_content(client: TestClient) -> None:
    """Context builder queries PostgreSQL and builds non-empty factual text."""
    from app.db.session import SessionLocal

    with SessionLocal() as db:
        context = build_portfolio_context(db, force_refresh=True)
        assert len(context) > 200
        assert "Yosef Teshome" in context
        assert "AI Backend & Platform Engineer" in context
        assert "Enterprise AI Knowledge Platform" in context


def test_chat_valid_streaming_request(client: TestClient) -> None:
    """POST /chat with valid payload returns SSE stream."""
    payload = {
        "messages": [
            {"role": "user", "content": "What AI projects has Yosef built?"}
        ]
    }
    response = client.post(f"{settings.api_v1_prefix}/chat", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    assert "data:" in response.text
    assert "[DONE]" in response.text


def test_chat_empty_messages_validation_error(client: TestClient) -> None:
    """POST /chat with empty messages array returns 422."""
    payload = {"messages": []}
    response = client.post(f"{settings.api_v1_prefix}/chat", json=payload)
    assert response.status_code == 422


def test_chat_last_message_must_be_user(client: TestClient) -> None:
    """POST /chat where last message is assistant returns 422."""
    payload = {
        "messages": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi there!"},
        ]
    }
    response = client.post(f"{settings.api_v1_prefix}/chat", json=payload)
    assert response.status_code == 422


def test_chat_excessive_message_length(client: TestClient) -> None:
    """POST /chat with message exceeding max length returns 422 or 400."""
    huge_text = "A" * 4500
    payload = {
        "messages": [
            {"role": "user", "content": huge_text}
        ]
    }
    response = client.post(f"{settings.api_v1_prefix}/chat", json=payload)
    assert response.status_code in (400, 422)

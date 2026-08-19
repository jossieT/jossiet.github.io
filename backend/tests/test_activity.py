"""Tests for the sanitized activity publisher, schemas, and SSE stream endpoint."""

from fastapi.testclient import TestClient
from app.schemas.activity import ActivityType, PublicActivityEvent
from app.services.activity import publish_activity, recent_activity


def test_publish_activity_sanitized_fields():
    event = publish_activity(
        ActivityType.API,
        "Test API query",
        status="success",
        duration_ms=14.2,
    )
    assert isinstance(event, PublicActivityEvent)
    assert event.type == ActivityType.API
    assert event.message == "Test API query"
    assert event.status == "success"
    assert event.duration_ms == 14
    assert event.timestamp is not None


def test_recent_activity_contains_published_event():
    publish_activity(ActivityType.RAG, "Test RAG search")
    history = recent_activity()
    assert len(history) > 0
    assert any(e.message == "Test RAG search" for e in history)


def test_activity_stream_endpoint(client: TestClient):
    publish_activity(ActivityType.DB, "Test DB operation")
    response = client.get("/api/v1/activity/stream")
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")
    assert "data:" in response.text

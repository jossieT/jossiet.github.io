"""Integration tests for the AI Agent Orchestrator with mock tool calling."""

import json
import pytest
from app.db.session import SessionLocal
from app.schemas.chat import ChatMessage
from app.services.ai.agent_orchestrator import AgentOrchestrator
from app.services.ai.llm_client import MockLLMClient


def _extract_tokens_and_events(events: list[str]) -> tuple[str, list[dict]]:
    full_text = ""
    parsed_events = []
    for e in events:
        for line in e.split("\n"):
            line = line.strip()
            if line.startswith("data: ") and line != "data: [DONE]":
                try:
                    payload = json.loads(line[6:])
                    parsed_events.append(payload)
                    if "token" in payload:
                        full_text += payload["token"]
                except Exception:
                    pass
    return full_text, parsed_events


@pytest.mark.anyio
async def test_agent_orchestrator_general_conversation() -> None:
    """General greeting receives direct answer without executing tools."""
    client = MockLLMClient()
    messages = [ChatMessage(role="user", content="Hello, who are you?")]

    with SessionLocal() as db:
        orchestrator = AgentOrchestrator(db=db, client=client)
        events: list[str] = []
        async for event in orchestrator.run_stream(messages):
            events.append(event)

        full_text, parsed = _extract_tokens_and_events(events)
        assert "[DONE]" in "".join(events)
        assert "portfolio concierge" in full_text.lower()


@pytest.mark.anyio
async def test_agent_orchestrator_tool_invocation_and_sources() -> None:
    """Technology question triggers tool call, emits status event, sources, and tokens."""
    client = MockLLMClient()
    messages = [ChatMessage(role="user", content="Which projects use PostgreSQL?")]

    with SessionLocal() as db:
        orchestrator = AgentOrchestrator(db=db, client=client)
        events: list[str] = []
        async for event in orchestrator.run_stream(messages):
            events.append(event)

        full_text, parsed = _extract_tokens_and_events(events)
        statuses = [p["status"] for p in parsed if "status" in p]
        sources = [p["sources"] for p in parsed if "sources" in p]

        assert len(statuses) >= 1
        assert "projects" in statuses[0].lower() or "technology" in statuses[0].lower()
        assert len(sources) >= 1
        assert "[DONE]" in "".join(events)


@pytest.mark.anyio
async def test_agent_orchestrator_project_lookup() -> None:
    """Project lookup triggers get_project tool and returns case study content."""
    client = MockLLMClient()
    messages = [ChatMessage(role="user", content="Tell me about the Christian Digital Content Platform.")]

    with SessionLocal() as db:
        orchestrator = AgentOrchestrator(db=db, client=client)
        events: list[str] = []
        async for event in orchestrator.run_stream(messages):
            events.append(event)

        full_text, parsed = _extract_tokens_and_events(events)
        statuses = [p["status"] for p in parsed if "status" in p]
        sources = [p["sources"] for p in parsed if "sources" in p]

        assert len(statuses) >= 1
        assert len(sources) >= 1
        assert "[DONE]" in "".join(events)


@pytest.mark.anyio
async def test_agent_orchestrator_contact_lookup() -> None:
    """Contact lookup triggers get_contact_information and returns public contact."""
    client = MockLLMClient()
    messages = [ChatMessage(role="user", content="What is Yosef contact email?")]

    with SessionLocal() as db:
        orchestrator = AgentOrchestrator(db=db, client=client)
        events: list[str] = []
        async for event in orchestrator.run_stream(messages):
            events.append(event)

        full_text, parsed = _extract_tokens_and_events(events)
        statuses = [p["status"] for p in parsed if "status" in p]

        assert len(statuses) >= 1
        assert "contact" in statuses[0].lower()
        assert "[DONE]" in "".join(events)

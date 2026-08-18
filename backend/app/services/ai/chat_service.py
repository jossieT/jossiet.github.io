"""AI Chat Service.

Entry point for portfolio assistant chat requests. In Phase 7, the streaming chat
pipeline is orchestrated by the controlled AI Agent Orchestrator with tool calling,
RAG semantic search, limit enforcement, and source attribution.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from sqlalchemy.orm import Session

from app.schemas.chat import ChatMessage
from app.services.ai.agent_orchestrator import AgentOrchestrator
from app.services.ai.llm_client import BaseLLMClient
from app.services.ai.tools.registry import ToolRegistry

logger = logging.getLogger(__name__)


async def stream_chat_response(
    messages: list[ChatMessage],
    db: Session,
    client: BaseLLMClient | None = None,
    registry: ToolRegistry | None = None,
) -> AsyncIterator[str]:
    """Stream SSE events from the controlled AI Agent Orchestrator."""
    orchestrator = AgentOrchestrator(db=db, client=client, registry=registry)
    async for event in orchestrator.run_stream(messages):
        yield event

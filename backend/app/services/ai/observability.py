"""Lightweight observability and structured metric logging for AI Agent operations."""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("app.services.ai.agent")


@dataclass
class ToolExecutionMetric:
    """Metric record for an individual tool invocation."""

    tool_name: str
    duration_ms: float
    success: bool
    error: str | None = None


@dataclass
class AgentRunMetrics:
    """Summary metrics recorded during a complete agent execution run."""

    query: str
    provider: str
    model: str
    iterations: int = 0
    total_duration_ms: float = 0.0
    tool_calls: list[ToolExecutionMetric] = field(default_factory=list)
    rag_used: bool = False
    source_count: int = 0
    success: bool = True
    error: str | None = None

    def log_summary(self) -> None:
        """Output structured log entry with clean metrics (omitting sensitive payloads)."""
        tools_summary = [
            f"{t.tool_name}({t.duration_ms:.1f}ms, {'ok' if t.success else 'err'})"
            for t in self.tool_calls
        ]
        logger.info(
            "Agent Run Summary | Duration: %.1fms | Iterations: %d | Tools (%d): [%s] | RAG: %s | Sources: %d | Status: %s",
            self.total_duration_ms,
            self.iterations,
            len(self.tool_calls),
            ", ".join(tools_summary) if tools_summary else "none",
            "yes" if self.rag_used else "no",
            self.source_count,
            "SUCCESS" if self.success else f"ERROR({self.error})",
        )


class AgentMetricsCollector:
    """Context tracker collecting performance and usage metrics during an agent turn."""

    def __init__(self, query: str, provider: str, model: str) -> None:
        self.metrics = AgentRunMetrics(query=query[:60], provider=provider, model=model)
        self._start_time = time.perf_counter()

    def record_iteration(self) -> None:
        self.metrics.iterations += 1

    def record_tool_call(
        self, tool_name: str, duration_ms: float, success: bool, error: str | None = None
    ) -> None:
        self.metrics.tool_calls.append(
            ToolExecutionMetric(
                tool_name=tool_name,
                duration_ms=duration_ms,
                success=success,
                error=error,
            )
        )
        if tool_name == "search_knowledge_rag":
            self.metrics.rag_used = True

    def complete(self, source_count: int, success: bool = True, error: str | None = None) -> None:
        self.metrics.total_duration_ms = (time.perf_counter() - self._start_time) * 1000.0
        self.metrics.source_count = source_count
        self.metrics.success = success
        self.metrics.error = error
        self.metrics.log_summary()

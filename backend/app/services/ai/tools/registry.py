"""Centralized typed Tool Registry and safe execution engine for the AI Agent."""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass
from typing import Any, Callable, Type
from pydantic import BaseModel, ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.services.ai.tools.implementations import (
    find_projects_by_technology,
    get_contact_information,
    get_experience,
    get_project,
    get_services,
    search_articles,
    search_knowledge_rag,
    search_projects,
)
from app.services.ai.tools.schemas import (
    FindByTechnologyInput,
    GetContactInput,
    GetExperienceInput,
    GetProjectInput,
    GetServicesInput,
    SearchArticlesInput,
    SearchKnowledgeRagInput,
    SearchProjectsInput,
)

logger = logging.getLogger(__name__)


@dataclass
class ToolDefinition:
    """Registration metadata for an agent tool."""

    name: str
    description: str
    input_schema: Type[BaseModel]
    handler: Callable[[Session, Any], BaseModel]
    status_message: str  # User-friendly message for UI status event (e.g. "Searching projects...")


class ToolExecutionResult(BaseModel):
    """Result container for a tool invocation."""

    tool_name: str
    success: bool
    data: dict[str, Any] | None = None
    error: str | None = None
    status_message: str = ""
    sources: list[dict[str, str]] = []


class ToolRegistry:
    """Registry maintaining tool schemas, handler bindings, and safe execution wrappers."""

    def __init__(self) -> None:
        self._tools: dict[str, ToolDefinition] = {}
        self._register_default_tools()

    def register(
        self,
        name: str,
        description: str,
        input_schema: Type[BaseModel],
        handler: Callable[[Session, Any], BaseModel],
        status_message: str,
    ) -> None:
        self._tools[name] = ToolDefinition(
            name=name,
            description=description,
            input_schema=input_schema,
            handler=handler,
            status_message=status_message,
        )

    def get_tool(self, name: str) -> ToolDefinition | None:
        return self._tools.get(name)

    def list_tools(self) -> list[ToolDefinition]:
        return list(self._tools.values())

    def get_openai_tools_schema(self) -> list[dict[str, Any]]:
        """Generate OpenAI/OpenRouter-compatible function calling tool definitions."""
        schemas = []
        for tool in self._tools.values():
            pydantic_schema = tool.input_schema.model_json_schema()
            # Clean up schema for LLM
            pydantic_schema.pop("title", None)
            schemas.append(
                {
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": pydantic_schema,
                    },
                }
            )
        return schemas

    async def execute(
        self,
        name: str,
        raw_args: dict[str, Any] | str,
        db: Session,
        timeout_seconds: float | None = None,
    ) -> ToolExecutionResult:
        """Safely validate arguments and execute a registered tool within a timeout boundary."""
        if timeout_seconds is None:
            timeout_seconds = float(settings.tool_timeout_seconds)

        tool = self._tools.get(name)
        if not tool:
            logger.warning("Agent attempted to execute unknown tool: '%s'", name)
            return ToolExecutionResult(
                tool_name=name,
                success=False,
                error=f"Tool '{name}' is not recognized. Available tools: {list(self._tools.keys())}",
            )

        # Parse string arguments if given as JSON string from LLM
        if isinstance(raw_args, str):
            try:
                args_dict = json.loads(raw_args) if raw_args.strip() else {}
            except json.JSONDecodeError as e:
                return ToolExecutionResult(
                    tool_name=name,
                    success=False,
                    error=f"Invalid JSON arguments: {e}",
                    status_message=tool.status_message,
                )
        else:
            args_dict = raw_args or {}

        # Validate input schema
        try:
            validated_input = tool.input_schema.model_validate(args_dict)
        except ValidationError as val_err:
            logger.warning("Tool '%s' argument validation failed: %s", name, val_err)
            return ToolExecutionResult(
                tool_name=name,
                success=False,
                error=f"Invalid arguments for {name}: {val_err.errors()}",
                status_message=tool.status_message,
            )

        # Execute handler safely with timeout
        try:
            loop = asyncio.get_running_loop()
            result_model = await asyncio.wait_for(
                loop.run_in_executor(None, tool.handler, db, validated_input),
                timeout=timeout_seconds,
            )
            result_data = result_model.model_dump(mode="json")
            sources = self._extract_sources(name, result_data)

            return ToolExecutionResult(
                tool_name=name,
                success=True,
                data=result_data,
                status_message=tool.status_message,
                sources=sources,
            )

        except asyncio.TimeoutError:
            logger.error("Tool '%s' timed out after %.1fs", name, timeout_seconds)
            return ToolExecutionResult(
                tool_name=name,
                success=False,
                error=f"Tool '{name}' timed out after {timeout_seconds}s.",
                status_message=tool.status_message,
            )
        except Exception as exc:
            logger.exception("Unexpected error executing tool '%s': %s", name, exc)
            return ToolExecutionResult(
                tool_name=name,
                success=False,
                error=f"An error occurred while executing {name}: {str(exc)}",
                status_message=tool.status_message,
            )

    def _extract_sources(self, tool_name: str, data: dict[str, Any]) -> list[dict[str, str]]:
        """Derive frontend source attribution badges from tool result data."""
        sources: list[dict[str, str]] = []
        if tool_name == "get_project" and data.get("found"):
            sources.append(
                {
                    "source_type": "project",
                    "source_title": data.get("title") or data.get("slug", "Project"),
                    "source_url": data.get("url", "/projects"),
                    "section": "Project Case Study",
                }
            )
        elif tool_name in ("search_projects", "find_projects_by_technology"):
            for p in data.get("projects", []):
                sources.append(
                    {
                        "source_type": "project",
                        "source_title": p.get("title", "Project"),
                        "source_url": p.get("url", "/projects"),
                        "section": "Projects Overview",
                    }
                )
        elif tool_name == "get_experience":
            for item in data.get("items", []):
                sources.append(
                    {
                        "source_type": "experience",
                        "source_title": f"{item.get('role')} @ {item.get('company')}",
                        "source_url": "/experience",
                        "section": "Professional Experience",
                    }
                )
        elif tool_name == "get_services":
            for s in data.get("services", []):
                sources.append(
                    {
                        "source_type": "service",
                        "source_title": s.get("title", "Service"),
                        "source_url": "/services",
                        "section": "Consulting & Engineering Services",
                    }
                )
        elif tool_name == "search_articles":
            for a in data.get("articles", []):
                sources.append(
                    {
                        "source_type": "article",
                        "source_title": a.get("title", "Article"),
                        "source_url": a.get("url", "/articles"),
                        "section": "Technical Publications",
                    }
                )
        elif tool_name == "get_contact_information":
            sources.append(
                {
                    "source_type": "biography",
                    "source_title": "Yosef Teshome — Contact Information",
                    "source_url": "/contact",
                    "section": "Contact & Availability",
                }
            )
        elif tool_name == "search_knowledge_rag":
            for chunk in data.get("chunks", []):
                sources.append(
                    {
                        "source_type": chunk.get("source_type", "knowledge"),
                        "source_title": chunk.get("source_title", "Knowledge Base"),
                        "source_url": chunk.get("source_url", "/"),
                        "section": chunk.get("section", "Knowledge Chunk"),
                    }
                )
        return sources

    def _register_default_tools(self) -> None:
        self.register(
            name="search_projects",
            description="Search portfolio engineering projects by keyword, category ('ai', 'backend', 'fullstack', 'cloud'), or technology tag.",
            input_schema=SearchProjectsInput,
            handler=search_projects,
            status_message="Searching projects...",
        )
        self.register(
            name="get_project",
            description="Get comprehensive engineering case study details for a specific project by slug (architecture, problems, decisions, security, metrics).",
            input_schema=GetProjectInput,
            handler=get_project,
            status_message="Loading project case study...",
        )
        self.register(
            name="find_projects_by_technology",
            description="Find all projects that use a specific technology or framework (e.g. 'PostgreSQL', 'FastAPI', 'Redis', 'pgvector', 'Docker', 'Next.js').",
            input_schema=FindByTechnologyInput,
            handler=find_projects_by_technology,
            status_message="Filtering projects by technology...",
        )
        self.register(
            name="get_experience",
            description="Retrieve Yosef's professional roles, companies, engineering achievements, and technical highlights.",
            input_schema=GetExperienceInput,
            handler=get_experience,
            status_message="Checking work experience...",
        )
        self.register(
            name="get_services",
            description="Retrieve Yosef's engineering, architectural consulting, and AI systems development service offerings.",
            input_schema=GetServicesInput,
            handler=get_services,
            status_message="Fetching service offerings...",
        )
        self.register(
            name="search_articles",
            description="Search published technical articles, architecture deep-dives, and thought leadership pieces by Yosef.",
            input_schema=SearchArticlesInput,
            handler=search_articles,
            status_message="Searching technical articles...",
        )
        self.register(
            name="get_contact_information",
            description="Retrieve Yosef's verified public contact details, email, GitHub, LinkedIn, and current availability status.",
            input_schema=GetContactInput,
            handler=get_contact_information,
            status_message="Retrieving contact information...",
        )
        self.register(
            name="search_knowledge_rag",
            description="Search Yosef's technical knowledge base using semantic vector retrieval for deep questions about architecture, engineering decisions, performance metrics, and challenges.",
            input_schema=SearchKnowledgeRagInput,
            handler=search_knowledge_rag,
            status_message="Consulting semantic knowledge base...",
        )


_global_registry: ToolRegistry | None = None


def get_tool_registry() -> ToolRegistry:
    """Singleton getter for the ToolRegistry."""
    global _global_registry
    if _global_registry is None:
        _global_registry = ToolRegistry()
    return _global_registry

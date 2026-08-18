# AI Agent Architecture & Tool Execution Specification

## 1. Overview & Primary Goal

The Yosef Teshome Personal Portfolio Platform features an enterprise-grade, controlled AI Agent acting as Yosef's AI Portfolio Concierge. The agent upgrades the traditional RAG pattern into an interactive, multi-step tool-calling agent capable of selecting typed domain tools and semantic retrieval to synthesize factual, grounded answers.

```
Visitor Question
      ↓
Chat API (`POST /api/v1/chat`)
      ↓
Rate Limiter (Redis Sliding Window)
      ↓
Agent Orchestrator (`AgentOrchestrator`)
      ↓
LLM Provider (OpenRouter Gemini 3.5 Flash / Mock)
      ↓
Tool Selection / Multi-Turn Loop
   ├── `search_projects` (Filtered project lookup)
   ├── `get_project` (Case study deep dive)
   ├── `find_projects_by_technology` (Tech stack mapping)
   ├── `get_experience` (Career history & roles)
   ├── `get_services` (Consulting & engineering services)
   ├── `search_articles` (Technical publications)
   ├── `get_contact_information` (Public channels & availability)
   └── `search_knowledge_rag` (pgvector cosine retrieval)
      ↓
Tool Execution & Source Extraction (`ToolRegistry`)
      ↓
Grounded Final Answer + SSE Streaming Badges
```

---

## 2. Safety & Security Boundaries

1. **Zero Direct Resource Access**: The LLM never has direct access to PostgreSQL, Redis, the host filesystem, shell execution, environment variables, or private data.
2. **Typed Schema Isolation**: All tools define strict Pydantic input and output schemas. Raw SQL queries or internal IDs are never exposed in tool schemas or outputs.
3. **Untrusted Tool Outputs**: Tool outputs are injected as factual data records in conversation turns, strictly isolated from system behavior instructions.
4. **Secrets Confidentiality**: System prompt rules forbid outputting system prompt templates, API keys, or backend architecture secrets.
5. **No Hallucination Mandate**: If information is absent from tool results and RAG search, the agent states its absence and directs the visitor to Yosef's verified contact channels.

---

## 3. Tool Specifications

| Tool Name | Purpose | Primary Parameters | Return Type |
|---|---|---|---|
| `search_projects` | Search projects by keyword, category, or technology | `query`, `category`, `technology`, `limit` | `SearchProjectsOutput` |
| `get_project` | Retrieve full case study details by project slug | `slug` | `ProjectDetailOutput` |
| `find_projects_by_technology` | Filter projects utilizing a specific framework | `technology`, `limit` | `FindByTechnologyOutput` |
| `get_experience` | Work history, roles, and engineering highlights | `technology`, `role`, `organization` | `GetExperienceOutput` |
| `get_services` | Architecture and consulting service offerings | `category` | `GetServicesOutput` |
| `search_articles` | Published technical articles and deep dives | `query`, `category`, `limit` | `SearchArticlesOutput` |
| `get_contact_information` | Public contact channels and work availability | *(none)* | `ContactOutput` |
| `search_knowledge_rag` | Semantic similarity retrieval over pgvector | `query`, `top_k` | `SearchKnowledgeRagOutput` |

---

## 4. Agent Limits & Cost Controls

Configurable via `app/core/config.py` and backend environment variables:
- **`MAX_AGENT_ITERATIONS`** (`default: 3`): Prevents recursive tool calling loops.
- **`MAX_TOOL_CALLS`** (`default: 5`): Upper bound on total tool invocations per user turn.
- **`TOOL_TIMEOUT`** (`default: 10` seconds): Timeout boundary per tool execution preventing hung database transactions.
- **`AI_MAX_INPUT_LENGTH`** (`default: 2000` chars): Limits input payload size.
- **`AI_RATE_LIMIT_PER_HOUR`** (`default: 20` requests): Anonymous IP rate limit via Redis sliding window.

---

## 5. Observability & Telemetry

Each agent execution records structured telemetry via `AgentMetricsCollector` (`app/services/ai/observability.py`):
- Total duration in milliseconds
- Number of iterations and tool calls
- Per-tool execution duration and success/error status
- RAG semantic search activation flag
- Number of deduplicated source citations generated
- No sensitive user messages or secrets are logged

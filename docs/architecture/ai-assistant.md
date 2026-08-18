# AI Portfolio Assistant Architecture (Phase 5)

## Overview

The AI Portfolio Concierge provides visitors, recruiters, and engineering managers with an interactive conversational interface to query Yosef Teshome's background, architectural case studies, technical competencies, and service offerings.

```
Visitor (Browser)
       │
       ▼
Next.js Chat UI (ChatWidget / ChatPanel / ChatMessages)
       │  POST /api/v1/chat (SSE Stream)
       ▼
FastAPI Backend (app.api.v1.chat)
       │
  ┌────┴───────────────────────────┐
  │  1. Redis Anonymous Rate Limit │
  │  2. Payload Length Validation  │
  └────┬───────────────────────────┘
       │
       ▼
AI Chat Service (app.services.ai.chat_service)
       │
  ┌────┴───────────────────────────────────────────────┐
  │  Portfolio Context Builder                         │
  │  (Compiles PostgreSQL rows: projects, skills,      │
  │   experience, services with 5-min in-memory cache) │
  └────┬───────────────────────────────────────────────┘
       │
       ▼
LLM Client Interface (app.services.ai.llm_client)
  ├── GeminiLLMClient (google-genai SDK, gemini-2.0-flash)
  └── MockLLMClient (test & local fallback mode)
       │
       ▼
StreamingResponse (text/event-stream)
       │
       ▼
Progressive Markdown Bubble in Next.js UI
```

---

## Architectural Principles & Boundaries

1. **Server-Side LLM Execution**: LLM credentials (`LLM_API_KEY`) reside exclusively in backend environment variables. The browser never communicates directly with third-party LLM APIs.
2. **Phase 5 Controlled Context**: Portfolio facts are queried directly from the PostgreSQL database (the single source of truth) and injected into the system prompt with strict anti-hallucination constraints.
3. **Retrieval / RAG Boundary**: Dense vector search, embeddings, pgvector indexing, and chunked semantic document retrieval are scheduled for **Phase 6**. Phase 5 intentionally uses high-density database context caching.
4. **Provider Neutrality**: The `BaseLLMClient` interface encapsulates model calls so providers can be swapped (e.g. Gemini, OpenAI, Claude) without altering routing or business logic.

---

## Configuration & Environment Variables

| Variable | Description | Default |
|---|---|---|
| `LLM_PROVIDER` | LLM service provider | `gemini` |
| `LLM_MODEL` | Target foundation model name | `gemini-2.0-flash` |
| `LLM_API_KEY` | Server-side API key | `""` (falls back to mock) |
| `AI_MAX_INPUT_LENGTH` | Max allowed characters in latest prompt | `2000` |
| `AI_MAX_HISTORY_MESSAGES` | Max previous conversation turns passed to LLM | `10` |
| `AI_MAX_OUTPUT_TOKENS` | Generation token budget per turn | `1024` |
| `AI_TIMEOUT_SECONDS` | Generation timeout | `30` |
| `AI_RATE_LIMIT_PER_HOUR` | Anonymous requests per client IP per hour | `20` |
| `AI_CONTEXT_CACHE_TTL` | Context cache expiration in seconds | `300` |

---

## Safety & Anti-Hallucination Measures

1. **System Instruction Guardrails**: Explicit constraints instructing the model to decline speculation on unverified technologies, revenue numbers, or client identities.
2. **Identity Clarity**: The assistant speaks as Yosef's AI portfolio concierge, avoiding false first-person claims ("I am Yosef").
3. **Prompt Injection Resistance**: Clear separation of system instructions and user message blocks.
4. **Redis Rate Limiting**: IP-based sliding window rate limiter protects against denial-of-service and runaway token consumption.

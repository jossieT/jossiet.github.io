# ADR-002: Use FastAPI instead of a second TypeScript backend

## Status

Accepted

## Context

The platform already has a TypeScript frontend, so a TypeScript-based backend (e.g., NestJS, Express) was an option. The AI portfolio assistant is a core future capability, and the portfolio's purpose is to demonstrate AI backend and platform engineering skills.

## Decision

Use **Python + FastAPI** for the backend.

## Consequences

### Positive

- Python is the dominant language for AI/ML work; future RAG, embeddings, and agent tooling integrate naturally.
- FastAPI provides typed request/response models via Pydantic, automatic OpenAPI docs, and async support with little ceremony.
- Pydantic + SQLAlchemy 2.x + Alembic is a modern, maintainable Python stack.
- Differentiates the portfolio: a Python backend strengthens the AI engineering direction the site is meant to showcase.
- Small, focused files and dependency inversion keep services testable.

### Negative / Trade-offs

- Two languages in the same repo (TypeScript + Python) means two ecosystems to maintain.
- Python backend cannot share types with the frontend directly.

## Alternatives Considered

- **NestJS (TypeScript)**: would unify the language but misses the AI ecosystem and the portfolio's backend-engineering narrative.
- **Express/Fastify**: lighter but less structured for a growing API surface.

## Related

- ADR-001 (Next.js frontend)
- ADR-004 (pgvector for RAG)

# ADR-003: PostgreSQL as the primary database

## Status

Accepted

## Context

The platform needs a reliable relational database for portfolio content (profile, experience, skills, projects, articles, contact) and, later, high-dimensional embeddings for RAG retrieval. Local development and production consistency matters.

## Decision

Use **PostgreSQL** as the primary database, run through Docker Compose in development.

## Consequences

### Positive

- Mature relational features: ACID transactions, constraints, schemas, and rich indexing.
- Exceptional JSON support and the **pgvector** extension for vector search later (ADR-004).
- SQLAlchemy 2.x + Alembic give type-safe access and versioned migrations.
- Widely supported in managed cloud offerings, so production deployment (later phases) is straightforward.

### Negative / Trade-offs

- A dedicated database service adds operational overhead compared to SQLite.
- Requires containerized or hosted infrastructure during development.

## Alternatives Considered

- **SQLite**: simplest for local dev but unsuitable for production parity and lacks vector support at the planned scale.
- **MySQL**: mature but weaker vector-extension story; pgvector keeps everything in one database.
- **PostgreSQL with a separate vector DB (e.g., Qdrant, Pinecone)**: deferred — see ADR-004.

## Related

- ADR-004 (pgvector for RAG)

# ADR-004: Use pgvector for RAG instead of a separate vector database

## Status

Accepted

## Context

The platform's future AI portfolio assistant requires RAG-based knowledge retrieval over documents, project case studies, and articles. Dedicated vector databases are an option; PostgreSQL is already the primary database.

## Decision

Use **pgvector** (a PostgreSQL extension) for vector storage and similarity search, in a later phase, rather than introducing a separate vector database initially.

## Consequences

### Positive

- No extra infrastructure to operate: embeddings live alongside relational content.
- PostgreSQL transactions and access patterns apply to vectors.
- Reduces operational complexity during early AI feature development.

### Negative / Trade-offs

- pgvector is not as feature-rich for vector workloads as dedicated engines (e.g., ANN index tuning, hybrid search ergonomics) at very large scale.
- May be revisited if scale demands a dedicated engine.

## Alternatives Considered

- **Qdrant / Pinecone / Weaviate**: dedicated vector databases with strong scalability, but they add operational cost and complexity now, which is unjustified at this stage.

## Related

- ADR-003 (PostgreSQL primary database)
- ADR-002 (FastAPI backend)

"""Semantic retrieval service using pgvector cosine similarity search."""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.activity import ActivityType
from app.services.activity import publish_activity
from app.services.rag.embedding import BaseEmbeddingService, get_embedding_service

logger = logging.getLogger(__name__)


@dataclass
class RetrievedChunk:
    """A relevant knowledge chunk returned by semantic search."""

    id: int
    title: str
    section: str
    content: str
    source_type: str
    source_title: str
    source_url: str
    similarity: float
    metadata_json: dict


def retrieve_relevant_chunks(
    db: Session,
    query: str,
    *,
    top_k: int | None = None,
    similarity_threshold: float | None = None,
    source_type: str | None = None,
    embedding_service: BaseEmbeddingService | None = None,
) -> list[RetrievedChunk]:
    """Retrieve top-K semantically similar chunks from pgvector."""
    if not query.strip():
        return []

    if top_k is None:
        top_k = settings.rag_top_k
    if similarity_threshold is None:
        similarity_threshold = settings.rag_similarity_threshold
    if embedding_service is None:
        embedding_service = get_embedding_service()

    # 1. Generate query embedding
    query_vector = embedding_service.get_embedding(query)
    vector_str = "[" + ",".join(f"{x:.6f}" for x in query_vector) + "]"

    # 2. Query pgvector using cosine distance
    # Embed the vector literal directly to avoid psycopg3 named-param / PostgreSQL cast (::) conflicts.
    # The vector_str is safe: it is produced by formatting float values from our own embedding model.
    if source_type:
        query_sql = f"""
            SELECT id, title, section, content, source_type, source_title, source_url, metadata_json,
                   1 - (embedding <=> '{vector_str}'::vector) AS similarity
            FROM knowledge_chunks
            WHERE (1 - (embedding <=> '{vector_str}'::vector)) >= :threshold
              AND source_type = :source_type
            ORDER BY similarity DESC
            LIMIT :top_k
        """
        params: dict[str, object] = {
            "threshold": similarity_threshold,
            "source_type": source_type,
            "top_k": top_k,
        }
    else:
        query_sql = f"""
            SELECT id, title, section, content, source_type, source_title, source_url, metadata_json,
                   1 - (embedding <=> '{vector_str}'::vector) AS similarity
            FROM knowledge_chunks
            WHERE (1 - (embedding <=> '{vector_str}'::vector)) >= :threshold
            ORDER BY similarity DESC
            LIMIT :top_k
        """
        params = {
            "threshold": similarity_threshold,
            "top_k": top_k,
        }

    start_time = time.perf_counter()

    results = db.execute(text(query_sql), params).fetchall()
    duration_ms = (time.perf_counter() - start_time) * 1000.0

    retrieved: list[RetrievedChunk] = []
    for row in results:
        retrieved.append(
            RetrievedChunk(
                id=row[0],
                title=row[1],
                section=row[2],
                content=row[3],
                source_type=row[4],
                source_title=row[5],
                source_url=row[6],
                metadata_json=row[7] if isinstance(row[7], dict) else {},
                similarity=float(row[8]),
            )
        )

    publish_activity(
        ActivityType.DB,
        f"pgvector hybrid search ({len(retrieved)} results)",
        duration_ms=duration_ms,
    )

    logger.info(
        "Semantic retrieval for '%s': found %d chunks (threshold=%.2f, top_k=%d)",
        query[:50],
        len(retrieved),
        similarity_threshold,
        top_k,
    )
    return retrieved

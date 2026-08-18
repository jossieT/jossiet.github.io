"""Knowledge ingestion & delta upsert pipeline for pgvector."""

from __future__ import annotations

import logging
import sys
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.knowledge import KnowledgeChunk
from app.services.rag.chunker import ChunkPayload, generate_all_chunks
from app.services.rag.embedding import BaseEmbeddingService, get_embedding_service

logger = logging.getLogger(__name__)


def ingest_knowledge_base(
    db: Session,
    embedding_service: BaseEmbeddingService | None = None,
    force_reindex: bool = False,
) -> dict[str, int]:
    """Ingest, embed, and upsert all portfolio entities into pgvector.

    Returns stats dict: {total_chunks, inserted, updated, skipped, deleted}.
    """
    if embedding_service is None:
        embedding_service = get_embedding_service()

    logger.info("Starting portfolio knowledge ingestion pipeline...")
    chunks: list[ChunkPayload] = generate_all_chunks(db)
    logger.info("Generated %d logical chunks from PostgreSQL data.", len(chunks))

    # Existing chunks map by (doc_id, chunk_index)
    existing_chunks = db.scalars(select(KnowledgeChunk)).all()
    existing_map: dict[tuple[str, int], KnowledgeChunk] = {
        (c.doc_id, c.chunk_index): c for c in existing_chunks
    }

    inserted = 0
    updated = 0
    skipped = 0
    current_keys: set[tuple[str, int]] = set()

    for chunk in chunks:
        key = (chunk.doc_id, chunk.chunk_index)
        current_keys.add(key)
        existing = existing_map.get(key)

        # Check if unchanged
        if existing and existing.content_hash == chunk.content_hash and not force_reindex:
            skipped += 1
            continue

        # Generate embedding
        logger.info("Embedding chunk '%s' (%s)...", chunk.title, chunk.doc_id)
        vector = embedding_service.get_embedding(chunk.content)

        if existing:
            # Update in place
            existing.title = chunk.title
            existing.section = chunk.section
            existing.content = chunk.content
            existing.content_hash = chunk.content_hash
            existing.source_type = chunk.source_type
            existing.source_title = chunk.source_title
            existing.source_url = chunk.source_url
            existing.metadata_json = chunk.metadata_json
            existing.embedding = vector
            updated += 1
        else:
            # Insert new
            new_chunk = KnowledgeChunk(
                doc_id=chunk.doc_id,
                chunk_index=chunk.chunk_index,
                title=chunk.title,
                section=chunk.section,
                content=chunk.content,
                content_hash=chunk.content_hash,
                source_type=chunk.source_type,
                source_title=chunk.source_title,
                source_url=chunk.source_url,
                metadata_json=chunk.metadata_json,
                embedding=vector,
            )
            db.add(new_chunk)
            inserted += 1

    # Delete orphaned chunks no longer in source data
    deleted = 0
    for key, chunk_obj in existing_map.items():
        if key not in current_keys:
            db.delete(chunk_obj)
            deleted += 1

    db.commit()
    stats = {
        "total_chunks": len(chunks),
        "inserted": inserted,
        "updated": updated,
        "skipped": skipped,
        "deleted": deleted,
    }
    logger.info("Ingestion completed: %s", stats)
    return stats


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
    with SessionLocal() as db:
        force = "--force" in sys.argv
        stats = ingest_knowledge_base(db, force_reindex=force)
        print("\nKnowledge base successfully indexed into pgvector:")
        print(f"   Total Chunks : {stats['total_chunks']}")
        print(f"   Inserted     : {stats['inserted']}")
        print(f"   Updated      : {stats['updated']}")
        print(f"   Skipped      : {stats['skipped']}")
        print(f"   Deleted      : {stats['deleted']}")


if __name__ == "__main__":
    main()

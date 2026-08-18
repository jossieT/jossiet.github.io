"""Tests for RAG pipeline: chunking, embedding, and semantic retrieval."""

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.rag.chunker import generate_all_chunks
from app.services.rag.embedding import MockEmbeddingService, get_embedding_service
from app.services.rag.retriever import retrieve_relevant_chunks


def test_chunker_extracts_structured_sections() -> None:
    """Chunker produces non-empty structured chunks from PostgreSQL database."""
    with SessionLocal() as db:
        chunks = generate_all_chunks(db)
        assert len(chunks) >= 20
        source_types = {c.source_type for c in chunks}
        assert "project" in source_types
        assert "experience" in source_types
        assert "skill" in source_types
        assert "service" in source_types
        assert "article" in source_types

        # Verify content integrity
        for chunk in chunks:
            assert chunk.title
            assert chunk.content
            assert chunk.content_hash
            assert len(chunk.content) > 30


def test_mock_embedding_service_deterministic() -> None:
    """MockEmbeddingService generates normalized 768-dim deterministic vectors."""
    service = MockEmbeddingService(dimension=768)
    vec1 = service.get_embedding("FastAPI microservices")
    vec2 = service.get_embedding("FastAPI microservices")
    vec3 = service.get_embedding("Completely different topic")

    assert len(vec1) == 768
    assert vec1 == vec2
    assert vec1 != vec3

    # Check unit norm
    magnitude = sum(x * x for x in vec1) ** 0.5
    assert abs(magnitude - 1.0) < 1e-4


def test_semantic_retriever_queries_pgvector() -> None:
    """Retriever queries PostgreSQL with cosine distance and returns typed chunks."""
    with SessionLocal() as db:
        results = retrieve_relevant_chunks(
            db,
            query="FastAPI pgvector RAG architecture",
            top_k=3,
            similarity_threshold=0.0,  # low threshold to guarantee match
        )
        assert isinstance(results, list)
        if results:
            first = results[0]
            assert hasattr(first, "source_title")
            assert hasattr(first, "source_url")
            assert hasattr(first, "similarity")
            assert isinstance(first.similarity, float)

"""Embedding service abstraction supporting OpenRouter, Google Gemini, and Mock modes."""

from __future__ import annotations

import hashlib
import logging
import math
import struct
from abc import ABC, abstractmethod
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class BaseEmbeddingService(ABC):
    """Abstract embedding service interface."""

    @abstractmethod
    def get_embedding(self, text: str) -> list[float]:
        """Generate a vector embedding for a single text string."""
        pass

    @abstractmethod
    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Generate vector embeddings for a batch of text strings."""
        pass


class OpenRouterEmbeddingService(BaseEmbeddingService):
    """OpenRouter / OpenAI-compatible embedding service."""

    def __init__(
        self,
        api_key: str,
        model: str = "openai/text-embedding-3-small",
        base_url: str = "https://openrouter.ai/api/v1",
        dimension: int = 768,
    ) -> None:
        self.api_key = api_key
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.dimension = dimension

    def get_embedding(self, text: str) -> list[float]:
        embeddings = self.get_embeddings([text])
        return embeddings[0] if embeddings else [0.0] * self.dimension

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        import httpx

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://yosefteshome.dev",
            "X-Title": "Yosef Portfolio",
            "Content-Type": "application/json",
        }
        body = {
            "model": self.model,
            "input": texts,
            "dimensions": self.dimension,
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(
                    f"{self.base_url}/embeddings",
                    headers=headers,
                    json=body,
                )
                if response.status_code == 200:
                    data = response.json()
                    # Sort by index
                    sorted_data = sorted(data["data"], key=lambda x: x["index"])
                    return [item["embedding"] for item in sorted_data]
                logger.warning(
                    "Embedding API error (%d): %s, using Mock fallback",
                    response.status_code,
                    response.text,
                )
        except Exception as e:
            logger.warning("Embedding request failed: %s, using Mock fallback", e)

        mock = MockEmbeddingService(dimension=self.dimension)
        return mock.get_embeddings(texts)


class GeminiEmbeddingService(BaseEmbeddingService):
    """Google Gemini embedding service using text-embedding-004 (768 dimensions)."""

    def __init__(self, api_key: str, model: str = "text-embedding-004") -> None:
        self.api_key = api_key
        self.model = model
        self._client: Any = None

    def _get_client(self) -> Any:
        if self._client is None:
            from google import genai

            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def get_embedding(self, text: str) -> list[float]:
        try:
            client = self._get_client()
            response = client.models.embed_content(
                model=self.model,
                contents=text,
            )
            return list(response.embeddings[0].values)
        except Exception as e:
            logger.warning("Gemini embedding failed: %s, using Mock fallback", e)
            return MockEmbeddingService(dimension=768).get_embedding(text)

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            client = self._get_client()
            response = client.models.embed_content(
                model=self.model,
                contents=texts,
            )
            return [list(emb.values) for emb in response.embeddings]
        except Exception as e:
            logger.warning("Gemini batch embedding failed: %s, using Mock fallback", e)
            return MockEmbeddingService(dimension=768).get_embeddings(texts)


class MockEmbeddingService(BaseEmbeddingService):
    """Deterministic, normalized 768-dimensional mock embedding service for tests and local dev."""

    def __init__(self, dimension: int = 768) -> None:
        self.dimension = dimension

    def _generate_vector(self, text: str) -> list[float]:
        raw_hash = hashlib.sha256(text.encode("utf-8")).digest()

        vec: list[float] = []
        for i in range(self.dimension):
            h = hashlib.sha256(raw_hash + struct.pack("<I", i)).digest()
            val = (int.from_bytes(h[:4], "little") / 0xFFFFFFFF) * 2.0 - 1.0
            vec.append(val)

        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

    def get_embedding(self, text: str) -> list[float]:
        return self._generate_vector(text)

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        return [self._generate_vector(t) for t in texts]


def get_embedding_service() -> BaseEmbeddingService:
    """Factory to retrieve configured embedding service."""
    provider = (settings.embedding_provider or settings.llm_provider).lower().strip()
    api_key = settings.effective_embedding_api_key.strip()

    if provider == "openrouter" and api_key:
        return OpenRouterEmbeddingService(
            api_key=api_key,
            model="openai/text-embedding-3-small",
            dimension=settings.embedding_dim,
        )

    if provider == "gemini" and api_key and not api_key.startswith("sk-or"):
        return GeminiEmbeddingService(
            api_key=api_key,
            model=settings.embedding_model,
        )

    logger.info("Using MockEmbeddingService (dimension=%d).", settings.embedding_dim)
    return MockEmbeddingService(dimension=settings.embedding_dim)

"""Application configuration loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env relative to this file so subprocess workers always find it
_ENV_FILE = Path(__file__).parent.parent.parent / ".env"


class Settings(BaseSettings):
    """Centralized application settings.

    Values are read from environment variables, with a root-level ``.env``
    file as the local development source. Never hardcode secrets in code.
    """

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Yosef Portfolio API"
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=False, alias="DEBUG")

    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")

    database_url: str = Field(alias="DATABASE_URL")
    redis_url: str = Field(alias="REDIS_URL")

    # Comma-separated list, e.g. "http://localhost:3000,http://127.0.0.1:3000"
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="CORS_ORIGINS",
    )

    # --- AI / LLM Configuration -------------------------------------------
    # Provider: "gemini" (default). Architecture allows swapping providers.
    llm_provider: str = Field(default="gemini", alias="LLM_PROVIDER")
    llm_model: str = Field(default="gemini-2.0-flash", alias="LLM_MODEL")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")

    # --- RAG & Embedding Configuration ------------------------------------
    embedding_provider: str = Field(default="gemini", alias="EMBEDDING_PROVIDER")
    embedding_model: str = Field(default="text-embedding-004", alias="EMBEDDING_MODEL")
    embedding_dim: int = Field(default=768, alias="EMBEDDING_DIM")
    embedding_api_key: str = Field(default="", alias="EMBEDDING_API_KEY")

    rag_top_k: int = Field(default=4, alias="RAG_TOP_K")
    rag_similarity_threshold: float = Field(default=0.60, alias="RAG_SIMILARITY_THRESHOLD")

    # Agent Limits & Controls
    max_agent_iterations: int = Field(default=3, alias="MAX_AGENT_ITERATIONS")
    max_tool_calls: int = Field(default=5, alias="MAX_TOOL_CALLS")
    tool_timeout_seconds: int = Field(default=10, alias="TOOL_TIMEOUT")

    # Limits (cost protection & abuse prevention)
    ai_max_input_length: int = Field(default=2000, alias="AI_MAX_INPUT_LENGTH")
    ai_max_history_messages: int = Field(default=10, alias="AI_MAX_HISTORY_MESSAGES")
    ai_max_output_tokens: int = Field(default=1024, alias="AI_MAX_OUTPUT_TOKENS")
    ai_timeout_seconds: int = Field(default=30, alias="AI_TIMEOUT_SECONDS")

    # Rate limiting: anonymous requests per hour per IP (uses Redis)
    ai_rate_limit_per_hour: int = Field(default=20, alias="AI_RATE_LIMIT_PER_HOUR")

    # Portfolio context cache TTL in seconds
    ai_context_cache_ttl: int = Field(default=300, alias="AI_CONTEXT_CACHE_TTL")

    @property
    def effective_embedding_api_key(self) -> str:
        """Returns embedding API key, falling back to LLM_API_KEY."""
        return self.embedding_api_key or self.llm_api_key

    @property
    def cors_origin_list(self) -> list[str]:
        """CORS origins as a list of normalized origins."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def ai_enabled(self) -> bool:
        """True when an LLM API key is configured."""
        return bool(self.llm_api_key)


@lru_cache
def get_settings() -> Settings:
    """Return a cached application settings instance."""
    return Settings()


settings = get_settings()

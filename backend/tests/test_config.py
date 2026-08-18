"""Tests for configuration loading."""

from app.core.config import Settings


def test_settings_load_required_values() -> None:
    """Core configuration values are loaded from the environment."""
    settings = Settings()

    assert settings.database_url.startswith("postgresql+psycopg://")
    assert settings.redis_url.startswith("redis://")
    assert settings.app_env == "test"
    assert settings.debug is False


def test_settings_parses_cors_origins() -> None:
    """CORS origins are parsed from a comma-separated string."""
    settings = Settings(
        CORS_ORIGINS="http://localhost:3000,https://example.com"
    )

    assert settings.cors_origin_list == [
        "http://localhost:3000",
        "https://example.com",
    ]


def test_settings_is_production_flag() -> None:
    """The production flag derives from APP_ENV."""
    settings = Settings(APP_ENV="production")

    assert settings.is_production is True

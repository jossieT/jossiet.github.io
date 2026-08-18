"""Structured logging configuration for the application."""

import logging
import sys

from app.core.config import settings

_LOGGING_FORMAT = (
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)


def configure_logging(level: int | None = None) -> None:
    """Configure root application logging.

    Logs are written to stdout in a simple structured format so they can be
    consumed by containers and future observability tooling.
    """
    log_level = level or (logging.DEBUG if settings.debug else logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Avoid duplicating handlers when configure_logging is called multiple times.
    for handler in root_logger.handlers:
        root_logger.removeHandler(handler)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(logging.Formatter(_LOGGING_FORMAT))

    root_logger.addHandler(console_handler)

    logging.getLogger("uvicorn.access").setLevel(logging.INFO)

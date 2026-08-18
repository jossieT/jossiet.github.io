"""Database engine and session management.

Uses SQLAlchemy 2.x with a synchronous psycopg driver. The session factory is
the single integration point for database access across the application.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


class DatabaseSessionManager:
    """Context-managed session dependency for FastAPI routes."""

    def __init__(self) -> None:
        self.session_factory = SessionLocal

    def get_db_session(self) -> Generator[Session, None, None]:
        """Yield a database session and ensure it is always closed."""
        db = self.session_factory()
        try:
            yield db
        finally:
            db.close()


session_manager = DatabaseSessionManager()
get_db = session_manager.get_db_session

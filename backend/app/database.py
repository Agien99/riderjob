from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal = None


if settings.database_url:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )


def get_db():
    if SessionLocal is None:
        raise RuntimeError(
            "Database connection is not configured."
        )

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
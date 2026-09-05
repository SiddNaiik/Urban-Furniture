import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Set env var in CI/local env.")


def get_engine(url: str = DATABASE_URL):
    return create_engine(url, pool_pre_ping=True)

engine = get_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def db_ping() -> bool:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
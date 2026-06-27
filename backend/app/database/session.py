"""
The Async Engine:
    The core manager that talks to the database.

The Session Factory:
    Generates new database sessions.

The get_db Dependency:
    Yields a session to routes and safely closes it.
"""

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.logging import logger

if not settings.database_url:
    raise ValueError("DATABASE_URL environment variable is missing or empty.")

# Using psycopg v3, this handles SSL, IPs, and Poolers natively
engine = create_async_engine(
    str(settings.database_url),
    echo=settings.debug,
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)


# Database dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


# Connectivity Check
async def verify_database_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to PostgreSQL!")
    except Exception as e:
        logger.info(f"CRITICAL: Database connection failed. Error: {e}")
        await engine.dispose()
        raise

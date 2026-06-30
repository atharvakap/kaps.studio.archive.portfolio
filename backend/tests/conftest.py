import sys
import asyncio
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.database.session import AsyncSessionLocal

# --- THIS IS THE CRITICAL FIX FOR WINDOWS ---
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
# --------------------------------------------

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """
    Creates an asynchronous test client for the FastAPI application
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a fresh database session for service-layer tests.
    Rolls back changes after each test to keep the database clean.
    """
    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()
        await session.close()
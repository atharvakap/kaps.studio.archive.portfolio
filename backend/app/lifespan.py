from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.logging import configure_logging, logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Logging here cuz the lifespan function runs exactly once during startup and shutdown
    configure_logging()
    logger.info("Application starting.")
    yield
    logger.info("Application shutting down.")
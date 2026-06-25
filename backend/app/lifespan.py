from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle.

    Startup and Shutdown resources will be added here in later phases.
    """
    yield
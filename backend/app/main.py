from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.database.session import verify_database_connection


# FastAPI has deprecated @app.on_event("startup")
# and @app.on_event("shutdown") hence a seperate function
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting portfolio API")
    await verify_database_connection()
    yield
    print("Shutting down portfolio API")


app = FastAPI(title="kaps.studio.archive Portfolio API", lifespan=lifespan)

# Register the root router
app.include_router(api_router)

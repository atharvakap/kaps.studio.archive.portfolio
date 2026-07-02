from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.database.session import verify_database_connection
from app.exceptions import (
    FileTooLargeError,
    InvalidFileTypeError,
    NotFoundError,
)
from app.logging import logger
from app.api import chat
from app.api import analytics


# FastAPI has deprecated @app.on_event("startup")
# and @app.on_event("shutdown") hence a seperate function
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("appication_starting", version="0.1.0")
    await verify_database_connection()
    yield
    logger.info("application_shutting_down")


app = FastAPI(title="kaps.studio.archive Portfolio API", lifespan=lifespan)


# Global exception handler
@app.exception_handler(NotFoundError)
async def not_found_exception_handler(request: Request, exc: NotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": exc.message},
    )


@app.exception_handler(InvalidFileTypeError)
async def invalid_file_type_exception_handler(request: Request, exc: InvalidFileTypeError):
    return JSONResponse(status_code=400, content={"detail": exc.message})


@app.exception_handler(FileTooLargeError)
async def file_too_large_exception_handler(request: Request, exc: FileTooLargeError):
    return JSONResponse(status_code=413, content={"detail": exc.message})


# Register the root router
app.include_router(api_router)
app.include_router(chat.router)
app.include_router(analytics.router)
# Root API router, aggregates all subrouters

from fastapi import APIRouter

from app.api.health import router

api_router = APIRouter()
api_router.include_router(router, tags=["health"])

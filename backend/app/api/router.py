# Root API router, aggregates all subrouters

from fastapi import APIRouter

from app.api import contact, health, profile, projects, resume, skills, testimonials

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
api_router.include_router(contact.router)
api_router.include_router(profile.router)
api_router.include_router(projects.router)
api_router.include_router(resume.router)
api_router.include_router(skills.router)
api_router.include_router(testimonials.router)

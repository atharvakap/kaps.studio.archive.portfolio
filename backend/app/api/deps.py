from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import AsyncSessionLocal
from app.services.profile_service import ProfileService
from app.services.skill_service import SkillService
from app.services.contact_service import ContactService
from app.services.project_service import ProjectService
from app.services.resume_service import ResumeService
from app.services.testimonial_service import TestimonialService

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provides a transactional database session per request"""
    async with AsyncSessionLocal() as session:
        yield session


# Servies injectors
def get_proofile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    return ProfileService(db)

def get_skill_service(db: AsyncSession = Depends(get_db)) -> SkillService:
    return SkillService(db)

def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(db)

def get_testimonial_service(db: AsyncSession = Depends(get_db)) -> TestimonialService:
    return TestimonialService(db)

def get_resume_service(db: AsyncSession = Depends(get_db)) -> ResumeService:
    return ResumeService(db)

def get_contact_service(db: AsyncSession = Depends(get_db)) -> ContactService:
    return ContactService(db)
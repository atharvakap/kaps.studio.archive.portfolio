import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

# Adjust these imports if your folder structure differs
from app.database.session import get_db 
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.services.experience import ExperienceService

router = APIRouter(
    prefix="/experience",
    tags=["Experience"]
)

def get_experience_service(db: AsyncSession = Depends(get_db)) -> ExperienceService:
    """Dependency to inject the ExperienceService."""
    return ExperienceService(db)

# --- FIXED: Removed trailing slash ("/" -> "") ---
@router.get("", response_model=List[ExperienceResponse], status_code=status.HTTP_200_OK)
async def get_all_experiences(service: ExperienceService = Depends(get_experience_service)):
    """Retrieve all experience records."""
    return await service.get_all()

@router.get("/{experience_id}", response_model=ExperienceResponse, status_code=status.HTTP_200_OK)
async def get_experience(
    experience_id: uuid.UUID, 
    service: ExperienceService = Depends(get_experience_service)
):
    """Retrieve a specific experience record by its ID."""
    experience = await service.get_by_id(experience_id)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Experience not found"
        )
    return experience

# --- FIXED: Removed trailing slash ("/" -> "") ---
@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    data: ExperienceCreate, 
    service: ExperienceService = Depends(get_experience_service)
):
    """Create a new experience record."""
    return await service.create(data)

@router.put("/{experience_id}", response_model=ExperienceResponse, status_code=status.HTTP_200_OK)
async def update_experience(
    experience_id: uuid.UUID, 
    data: ExperienceUpdate, 
    service: ExperienceService = Depends(get_experience_service)
):
    """Update an existing experience record."""
    experience = await service.update(experience_id, data)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Experience not found"
        )
    return experience

@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    experience_id: uuid.UUID, 
    service: ExperienceService = Depends(get_experience_service)
):
    """Delete an experience record."""
    success = await service.delete(experience_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Experience not found"
        )
from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.api.deps import get_skill_service
from app.services.skill_service import SkillService
from app.schemas.skill import SkillRead

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillRead])
async def get_skills(
    # Limit categories to 50 chars to prevent injection/spam
    category: Optional[str] = Query(None, max_length=50, description="Filter by category"),
    service: SkillService = Depends(get_skill_service)
):
    if category:
        return await service.get_skills_by_category(category)
    return await service.get_skills()
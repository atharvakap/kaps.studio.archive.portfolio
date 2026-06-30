from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_proofile_service
from app.services.profile_service import ProfileService
from app.schemas.profile import ProfileRead

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileRead)
async def get_profile(service: ProfileService = Depends(get_proofile_service)):
    profile = await service.get_profile()
    if not profile:
        raise HTTPException(status_code=404, details="Profile not found")
    return profile
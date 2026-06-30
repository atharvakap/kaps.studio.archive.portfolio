from fastapi import APIRouter, Depends

from app.api.deps import get_resume_service
from app.schemas.resume import ResumeRead
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.get("", response_model=ResumeRead)
async def get_resume(service: ResumeService = Depends(get_resume_service)):
    return await service.get_active_resume()

from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_resume_service
from app.services.resume_service import ResumeService
from app.schemas.resume import ResumeRead

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.get("", response_model=ResumeRead)
async def get_resume(service: ResumeService = Depends(get_resume_service)):
    resume = await service.get_active_resume()
    if not resume:
        raise HTTPException(status_code=404, detail="Active resume not found")
    return resume
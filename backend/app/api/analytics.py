from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Import your database dependency
from app.database.session import get_db 

# Import the service and schema we just created
from app.services import analytics_service
from app.schemas.analytics import ResumeDownloadRequest, AnalyticsReportResponse
from app.logging import logger

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.post("/resume-download")
async def track_resume_download(
    request: ResumeDownloadRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Records a resume download event in the database.
    The frontend should call this endpoint right before triggering the actual file download.
    """
    try:
        # Pass the validated request data straight to the service layer
        await analytics_service.record_resume_download(
            session=session,
            resume_id=request.resume_id,
            name=request.name,
            email=request.email
        )
        
        logger.info(
            "resume_download_tracked", 
            resume_id=str(request.resume_id), 
            visitor=request.email or "Anonymous"
        )
        
        return {"status": "success", "message": "Download tracked successfully"}
        
    except Exception as e:
        logger.error("resume_download_tracking_failed", error=str(e))
        # We return a 500 but generally want the frontend to fail silently for analytics
        # so it doesn't prevent the user from actually getting the resume if the DB hiccups.
        raise HTTPException(status_code=500, detail="Failed to track download")
    

@router.get("/overview", response_model=AnalyticsReportResponse)
async def get_analytics_overview(session: AsyncSession = Depends(get_db)):
    """
    Retrieves a real-time aggregation of all portfolio analytics.
    """
    try:
        return await analytics_service.get_overview_metrics(session)
    except Exception as e:
        logger.error("analytics_report_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to generate analytics report")
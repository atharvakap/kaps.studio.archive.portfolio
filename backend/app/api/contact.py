from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_contact_service
from app.database.session import get_db
from app.schemas.contact_message import ContactMessageCreate, ContactMessageRead
from app.services.contact_service import ContactService
from app.services import analytics_service
from app.logging import logger

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
async def create_contact_message(
    message_in: ContactMessageCreate, 
    service: ContactService = Depends(get_contact_service),
    session: AsyncSession = Depends(get_db)  # <-- Injected the DB session for analytics
):
    # 1. Save the actual contact message using your existing service
    new_message = await service.create_contact_message(message_in)
    
    # 2. Record the analytics event silently
    try:
        await analytics_service.record_contact_submission(session, new_message.id)
        logger.info("contact_submission_tracked", message_id=str(new_message.id))
    except Exception as e:
        # If the analytics database hiccups, the user still gets a success response!
        logger.error("analytics_tracking_failed", error=str(e))
        
    return new_message
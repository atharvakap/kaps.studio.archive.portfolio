from fastapi import APIRouter, Depends, status

from app.api.deps import get_contact_service
from app.schemas.contact_message import ContactMessageCreate, ContactMessageRead
from app.services.contact_service import ContactService

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("", response_model=ContactMessageRead, status_code=status.HTTP_201_CREATED)
async def create_contact_message(
    message_in: ContactMessageCreate, service: ContactService = Depends(get_contact_service)
):
    return await service.create_contact_message(message_in)

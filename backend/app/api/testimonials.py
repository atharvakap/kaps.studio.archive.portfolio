from typing import List

from fastapi import APIRouter, Depends

from app.api.deps import get_testimonial_service
from app.schemas.testimonial import TestimonialRead
from app.services.testimonial_service import TestimonialService

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=List[TestimonialRead])
async def get_testimonials(service: TestimonialService = Depends(get_testimonial_service)):
    return await service.get_testimonials()

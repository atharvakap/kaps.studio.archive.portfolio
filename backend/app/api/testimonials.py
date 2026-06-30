from fastapi import APIRouter, Depends
from typing import List
from app.api.deps import get_testimonial_service
from app.services.testimonial_service import TestimonialService
from app.schemas.testimonial import TestimonialRead

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

@router.get("", response_model=List[TestimonialRead])
async def get_testimonials(service: TestimonialService = Depends(get_testimonial_service)):
    return await service.get_testimonials()
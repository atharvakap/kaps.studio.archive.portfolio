from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.testimonial import Testimonial


class TestimonialService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_testimonials(self) -> Sequence[Testimonial]:
        """Fetch all testimonials."""
        stmt = select(Testimonial)
        result = await self.session.execute(stmt)
        return result.scalars().all()

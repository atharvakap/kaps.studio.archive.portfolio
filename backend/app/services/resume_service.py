from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundError
from app.models.resume import Resume


class ResumeService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_active_resume(self) -> Resume | None:
        """Fetch the most recently uploaded resume."""
        stmt = select(Resume).order_by(desc(Resume.created_at)).limit(1)
        result = await self.session.execute(stmt)
        resume = result.scalars().first()

        if not resume:
            raise NotFoundError("No active resume found.")

        return result.scalars().first()

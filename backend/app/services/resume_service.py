from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.resume import Resume

class ResumeService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_active_resume(self) -> Resume | None:
        """Fetch the most recently uploaded resume."""
        stmt = select(Resume).order_by(desc(Resume.created_at)).limit(1)
        result = await self.session.execute(stmt)
        return result.scalars().first()
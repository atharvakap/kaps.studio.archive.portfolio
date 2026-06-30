from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models.skill import Skill

class SkillService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_skills(self) -> Sequence[Skill]:
        """Fetch all skills."""
        stmt = select(Skill)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_skills_by_category(self, category: str) -> Sequence[Skill]:
        """Fetch skills filtered by a specific category."""
        stmt = select(Skill).where(Skill.category == category)
        result = await self.session.execute(stmt)
        return result.scalars().all()
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models.project import Project

class ProjectService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_projects(self) -> Sequence[Project]:
        """Fetch all projects."""
        stmt = select(Project)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_featured_projects(self) -> Sequence[Project]:
        """Fetch only featured projects."""
        stmt = select(Project).where(Project.featured == True)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_project_by_slug(self, slug: str) -> Project | None:
        """Fetch a single project by its unique slug."""
        stmt = select(Project).where(Project.slug == slug)
        result = await self.session.execute(stmt)
        return result.scalars().first()
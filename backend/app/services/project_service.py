from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.exceptions import NotFoundError
from app.models.project import Project
from app.models.project_skill import ProjectSkill


class ProjectService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_projects(self) -> Sequence[Project]:
        stmt = select(Project).options(
            selectinload(Project.project_skills).selectinload(ProjectSkill.skill)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_featured_projects(self) -> Sequence[Project]:
        stmt = (
            select(Project)
            .where(Project.featured)
            .options(selectinload(Project.project_skills).selectinload(ProjectSkill.skill))
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_project_by_slug(self, slug: str) -> Project:
        stmt = (
            select(Project)
            .where(Project.slug == slug)
            .options(selectinload(Project.project_skills).selectinload(ProjectSkill.skill))
        )
        result = await self.session.execute(stmt)

        # Call it EXACTLY once
        project = result.scalars().first()

        if not project:
            raise NotFoundError(f"Project with slug '{slug}' not found.")

        # Return the variable, not a second call
        return project

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile


class ProfileService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_profile(self) -> Profile | None:
        """Fetch the primary profile (assuming a single-user portfolio)."""
        stmt = select(Profile).limit(1)
        result = await self.session.execute(stmt)
        return result.scalars().first()

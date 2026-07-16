import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate

class ExperienceService:
    def __init__(self, db: AsyncSession):
        """
        Initializes the service with a database session.
        This session will be injected by FastAPI's dependency injection later.
        """
        self.db = db

    async def get_all(self) -> List[Experience]:
        """Fetch all experiences, ordered by display_order."""
        query = select(Experience).order_by(Experience.display_order.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, experience_id: uuid.UUID) -> Optional[Experience]:
        """Fetch a single experience by its UUID."""
        query = select(Experience).where(Experience.id == experience_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create(self, data: ExperienceCreate) -> Experience:
        """Create a new experience record."""
        # Convert the Pydantic schema to a dict and unpack it into the SQLAlchemy model
        new_experience = Experience(**data.model_dump())
        
        self.db.add(new_experience)
        await self.db.commit()
        await self.db.refresh(new_experience)
        
        return new_experience

    async def update(self, experience_id: uuid.UUID, data: ExperienceUpdate) -> Optional[Experience]:
        """Update an existing experience record."""
        experience = await self.get_by_id(experience_id)
        if not experience:
            return None
            
        # exclude_unset=True ensures we only update fields the client actually provided
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(experience, key, value)
            
        await self.db.commit()
        await self.db.refresh(experience)
        return experience

    async def delete(self, experience_id: uuid.UUID) -> bool:
        """Delete an experience record."""
        experience = await self.get_by_id(experience_id)
        if not experience:
            return False
            
        await self.db.delete(experience)
        await self.db.commit()
        return True
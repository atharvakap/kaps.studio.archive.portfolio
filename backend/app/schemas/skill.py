from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    name: str
    category: str
    proficiency: int


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = None


class SkillRead(SkillBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SkillSummary(SkillBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)

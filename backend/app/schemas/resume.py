from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ResumeBase(BaseModel):
    file_url: str
    version: str


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    file_url: Optional[str] = None
    version: Optional[str] = None


class ResumeRead(ResumeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

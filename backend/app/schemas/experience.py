from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
import uuid

class ExperienceBase(BaseModel):
    company: str
    role: str
    description: str
    start_date: date
    end_date: Optional[date] = None
    display_order: int = 0

class ExperienceCreate(ExperienceBase):
    """Schema for creating a new experience record."""
    pass

class ExperienceUpdate(BaseModel):
    """Schema for updating an experience record. All fields are optional."""
    company: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    display_order: Optional[int] = None

class ExperienceResponse(ExperienceBase):
    """Schema for returning experience data to the client."""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    # Tells Pydantic to read data even if it's not a dict, but an ORM model
    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class TestimonialBase(BaseModel):
    author_name: str
    author_role: str
    content: str

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    content: Optional[str] = None

class TestimonialRead(TestimonialBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
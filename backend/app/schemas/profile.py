from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str
    avatar_url: Optional[str] = None
    email: EmailStr


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[EmailStr] = None


class ProfileRead(ProfileBase):
    id: UUID
    created_date: datetime
    updated_date: datetime

    model_config = ConfigDict(from_attributes=True)

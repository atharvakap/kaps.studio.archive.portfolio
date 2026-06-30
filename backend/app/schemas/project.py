from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.skill import SkillSummary

class ProjectBase(BaseModel):
    name: str
    slug: str
    description: str
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    featured: Optional[bool] = None


class ProjectRead(ProjectBase):
    id: UUID
    created_date: datetime
    updated_date: datetime

    skills: List[SkillSummary] = []
    model_config = ConfigDict(from_attributes=True)
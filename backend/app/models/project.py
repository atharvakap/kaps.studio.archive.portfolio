from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Boolean
from app.database.base import Base
from app.models.mixins import TimestampMixin
from typing import TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from app.models.project_skill import ProjectSkill

class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)

    # Typo fixed: projects_skills -> project_skills
    project_skills: Mapped[list["ProjectSkill"]] = relationship(
        "ProjectSkill",
        back_populates="project",
        cascade="all, delete-orphan"
    )
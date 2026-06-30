import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.project_skill import ProjectSkill


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    proficiency: Mapped[int] = mapped_column(nullable=False)

    project_skills: Mapped[list["ProjectSkill"]] = relationship(
        "ProjectSkill", back_populates="skill", cascade="all, delete-orphan"
    )

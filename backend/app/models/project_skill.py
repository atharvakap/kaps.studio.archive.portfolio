from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from app.database.base import Base
import uuid

class ProjectSkill(Base):
    __tablename__ = "project_skills"

    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("skills.id"), primary_key=True)

    # SQLAlchemy resolves "Project" and "Skill" automatically!
    project: Mapped["Project"] = relationship("Project", back_populates="project_skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="project_skills")
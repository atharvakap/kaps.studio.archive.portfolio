import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class Resume(Base, TimestampMixin):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    version: Mapped[str] = mapped_column(String(20), nullable=False)

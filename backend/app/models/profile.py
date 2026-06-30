import uuid

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    email: Mapped[str] = mapped_column(String(265), unique=True, nullable=False)

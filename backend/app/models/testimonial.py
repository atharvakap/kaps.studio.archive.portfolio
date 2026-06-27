from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text
from app.database.base import Base
from app.models.mixins import TimestampMixin
import uuid

class Testimonial(Base, TimestampMixin):
    __tablename__ = "testimonials"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    author_name: Mapped[str] = mapped_column(String(100), nullable=False)
    author_role: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
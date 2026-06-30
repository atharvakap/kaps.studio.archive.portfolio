import uuid

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.mixins import TimestampMixin


class ContactMessage(Base, TimestampMixin):
    __tablename__ = "contact_messages"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    sender_name: Mapped[str] = mapped_column(String(100), nullable=False)
    sender_email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

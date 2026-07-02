import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

# FIXED IMPORT PATH
from app.database.base import Base

class ChatVisitor(Base):
    __tablename__ = "chat_visitors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_active_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # One visitor can have many chat threads
    threads = relationship(
        "ChatThread", 
        back_populates="visitor", 
        cascade="all, delete-orphan"
    )
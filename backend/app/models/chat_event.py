import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base

class ChatEventType(str, enum.Enum):
    thread_created = "thread_created"
    message_sent = "message_sent"
    response_generated = "response_generated"

class ChatEvent(Base):
    __tablename__ = "chat_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("chat_threads.id", ondelete="CASCADE"), nullable=False)
    visitor_id = Column(UUID(as_uuid=True), ForeignKey("chat_visitors.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(SQLEnum(ChatEventType, name="chat_event_type_enum"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
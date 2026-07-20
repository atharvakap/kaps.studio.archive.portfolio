import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.database.base import Base

class MessageRole(str, enum.Enum):
    user = "user"
    assistant = "assistant"
    system = "system"

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("chat_threads.id", ondelete="CASCADE"), nullable=False)
    role = Column(SQLEnum(MessageRole, name="message_role_enum"), nullable=False)
    content = Column(Text, nullable=False)
    
    message_type = Column(String, default="text", nullable=False)
    metadata_ = Column("metadata", JSONB, default=dict, nullable=False) 

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # --- ADD THIS RELATIONSHIP BACK ---
    thread = relationship("ChatThread", back_populates="messages")
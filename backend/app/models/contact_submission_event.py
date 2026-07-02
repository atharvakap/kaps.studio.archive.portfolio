import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base

class ContactSubmissionEvent(Base):
    __tablename__ = "contact_submission_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # This links to the actual message, acting as our analytical reference
    contact_message_id = Column(UUID(as_uuid=True), ForeignKey("contact_messages.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Optional relationship back to the operational message
    message = relationship("ContactMessage")
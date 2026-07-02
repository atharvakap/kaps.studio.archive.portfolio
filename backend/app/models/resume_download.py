import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base

class ResumeDownload(Base):
    __tablename__ = "resume_downloads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    visitor_name = Column(String, nullable=True)
    visitor_email = Column(String, nullable=True)
    downloaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Optional: If you want a relationship back to the Resume model
    resume = relationship("Resume", backref="downloads")
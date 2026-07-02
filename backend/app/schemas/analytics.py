from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ResumeDownloadRequest(BaseModel):
    resume_id: UUID
    name: Optional[str] = None
    email: Optional[str] = None

class AnalyticsReportResponse(BaseModel):
    resume_downloads: int
    contact_submissions: int
    chat_threads: int
    user_messages: int
    assistant_messages: int
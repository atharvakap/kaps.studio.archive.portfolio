import uuid
from sqlalchemy.ext.asyncio import AsyncSession

# Update these imports if your model names/paths are slightly different
from app.models.resume_download import ResumeDownload
from app.models.contact_submission_event import ContactSubmissionEvent
from app.models.chat_event import ChatEvent, ChatEventType

from sqlalchemy import select, func
from app.models.chat_thread import ChatThread

async def record_resume_download(
    session: AsyncSession, 
    resume_id: uuid.UUID, 
    name: str | None = None, 
    email: str | None = None
) -> ResumeDownload:
    """
    Creates a discrete analytics record whenever a visitor downloads a resume.
    """
    download_record = ResumeDownload(
        resume_id=resume_id,
        visitor_name=name,
        visitor_email=email
    )
    
    session.add(download_record)
    await session.commit()
    await session.refresh(download_record)
    
    return download_record


async def record_contact_submission(session: AsyncSession, contact_message_id: uuid.UUID) -> ContactSubmissionEvent:
    """
    Creates a discrete analytics event for a successful contact form submission.
    """
    event = ContactSubmissionEvent(contact_message_id=contact_message_id)
    
    session.add(event)
    await session.commit()
    await session.refresh(event)
    
    return event


async def record_chat_event(
    session: AsyncSession, 
    thread_id: uuid.UUID, 
    visitor_id: uuid.UUID, 
    event_type: ChatEventType
) -> ChatEvent:
    """
    Logs a discrete chat event (thread created, message sent, response generated).
    """
    event = ChatEvent(
        thread_id=thread_id,
        visitor_id=visitor_id,
        event_type=event_type
    )
    
    session.add(event)
    # We do NOT commit here! We want this to piggyback on the existing 
    # chat_service commits so it shares the exact same database transaction.
    return event


async def get_overview_metrics(session: AsyncSession) -> dict:
    """
    Aggregates all analytics into a single overview report.
    """
    # Count totals
    res_downloads = await session.scalar(select(func.count()).select_from(ResumeDownload))
    contact_subs = await session.scalar(select(func.count()).select_from(ContactSubmissionEvent))
    chat_threads = await session.scalar(select(func.count()).select_from(ChatThread))
    
    # Count messages by type
    user_msgs = await session.scalar(
        select(func.count()).select_from(ChatEvent).where(ChatEvent.event_type == ChatEventType.message_sent)
    )
    ai_msgs = await session.scalar(
        select(func.count()).select_from(ChatEvent).where(ChatEvent.event_type == ChatEventType.response_generated)
    )

    return {
        "resume_downloads": res_downloads or 0,
        "contact_submissions": contact_subs or 0,
        "chat_threads": chat_threads or 0,
        "user_messages": user_msgs or 0,
        "assistant_messages": ai_msgs or 0,
    }
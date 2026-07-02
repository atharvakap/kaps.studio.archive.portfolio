import uuid
from datetime import datetime, timezone
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat_visitor import ChatVisitor
from app.models.chat_thread import ChatThread
from app.models.chat_message import ChatMessage, MessageRole

from app.services import analytics_service
from app.models.chat_event import ChatEventType

async def create_visitor(session: AsyncSession, name: str | None = None, email: str | None = None) -> ChatVisitor:
    """Creates a new visitor to track who is chatting."""
    visitor = ChatVisitor(name=name, email=email)
    session.add(visitor)
    await session.commit()
    await session.refresh(visitor)
    return visitor

async def get_visitor(session: AsyncSession, visitor_id: uuid.UUID) -> ChatVisitor | None:
    """Retrieves an existing visitor by their UUID."""
    stmt = select(ChatVisitor).where(ChatVisitor.id == visitor_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def update_last_active(session: AsyncSession, visitor_id: uuid.UUID) -> None:
    """Updates the visitor's last_active_at timestamp."""
    stmt = (
        update(ChatVisitor)
        .where(ChatVisitor.id == visitor_id)
        .values(last_active_at=datetime.now(timezone.utc))
    )
    await session.execute(stmt)
    await session.commit()

async def create_thread(session: AsyncSession, visitor_id: uuid.UUID, title: str = "New Conversation") -> ChatThread:
    """Creates a new chat thread for a visitor."""
    thread = ChatThread(visitor_id=visitor_id, title=title)
    session.add(thread)
    await session.commit()
    await session.refresh(thread)
    
    # NEW: Fire analytics event
    await analytics_service.record_chat_event(session, thread.id, visitor_id, ChatEventType.thread_created)
    await session.commit() # Commit the event
    
    return thread

async def get_thread(session: AsyncSession, thread_id: uuid.UUID) -> ChatThread | None:
    """Retrieves a specific chat thread."""
    stmt = select(ChatThread).where(ChatThread.id == thread_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def list_threads(session: AsyncSession, visitor_id: uuid.UUID) -> list[ChatThread]:
    """Lists all threads belonging to a specific visitor, ordered by most recently updated."""
    stmt = (
        select(ChatThread)
        .where(ChatThread.visitor_id == visitor_id)
        .order_by(ChatThread.updated_at.desc())
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())

async def add_message(session: AsyncSession, thread_id: uuid.UUID, role: MessageRole, content: str) -> ChatMessage:
    """Adds a message to a thread, updates the thread timestamp, and logs analytics."""
    # 1. Insert the message
    message = ChatMessage(thread_id=thread_id, role=role, content=content)
    session.add(message)
    
    # 2. Fetch the thread so we can update its timestamp AND get the visitor_id for analytics
    stmt = select(ChatThread).where(ChatThread.id == thread_id)
    result = await session.execute(stmt)
    thread = result.scalar_one_or_none()
    
    if thread:
        # Bump timestamp
        thread.updated_at = datetime.now(timezone.utc)
        
        # 3. Fire Analytics Event based on who sent the message!
        event_type = ChatEventType.message_sent if role == MessageRole.user else ChatEventType.response_generated
        await analytics_service.record_chat_event(session, thread.id, thread.visitor_id, event_type)
    
    # 4. Commit the entire transaction at once
    await session.commit()
    await session.refresh(message)
    return message

async def list_messages(session: AsyncSession, thread_id: uuid.UUID) -> list[ChatMessage]:
    """Retrieves all messages in a thread, in chronological order."""
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
        .order_by(ChatMessage.created_at.asc())
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())
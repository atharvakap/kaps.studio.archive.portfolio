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
    visitor = ChatVisitor(name=name, email=email)
    session.add(visitor)
    await session.commit()
    await session.refresh(visitor)
    return visitor

async def get_visitor(session: AsyncSession, visitor_id: uuid.UUID) -> ChatVisitor | None:
    stmt = select(ChatVisitor).where(ChatVisitor.id == visitor_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def update_last_active(session: AsyncSession, visitor_id: uuid.UUID) -> None:
    stmt = (
        update(ChatVisitor)
        .where(ChatVisitor.id == visitor_id)
        .values(last_active_at=datetime.now(timezone.utc))
    )
    await session.execute(stmt)
    await session.commit()

async def create_thread(session: AsyncSession, visitor_id: uuid.UUID, title: str = "New Conversation") -> ChatThread:
    thread = ChatThread(visitor_id=visitor_id, title=title)
    session.add(thread)
    await session.commit()
    await session.refresh(thread)
    
    await analytics_service.record_chat_event(session, thread.id, visitor_id, ChatEventType.thread_created)
    await session.commit() 
    
    return thread

async def get_thread(session: AsyncSession, thread_id: uuid.UUID) -> ChatThread | None:
    stmt = select(ChatThread).where(ChatThread.id == thread_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def list_threads(session: AsyncSession, visitor_id: uuid.UUID) -> list[ChatThread]:
    stmt = (
        select(ChatThread)
        .where(ChatThread.visitor_id == visitor_id)
        .order_by(ChatThread.updated_at.desc())
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())

async def add_message(
    session: AsyncSession, 
    thread_id: uuid.UUID, 
    role: MessageRole, 
    content: str,
    message_type: str = "text",
    metadata: dict = None
) -> ChatMessage:
    # 1. Insert the message with the new rich content fields
    message = ChatMessage(
        thread_id=thread_id, 
        role=role, 
        content=content,
        message_type=message_type,
        metadata_=metadata or {}
    )
    session.add(message)
    
    # 2. Fetch the thread to update timestamp and get visitor_id
    stmt = select(ChatThread).where(ChatThread.id == thread_id)
    result = await session.execute(stmt)
    thread = result.scalar_one_or_none()
    
    if thread:
        thread.updated_at = datetime.now(timezone.utc)
        event_type = ChatEventType.message_sent if role == MessageRole.user else ChatEventType.response_generated
        await analytics_service.record_chat_event(session, thread.id, thread.visitor_id, event_type)
    
    # 3. Commit transaction
    await session.commit()
    await session.refresh(message)
    return message

async def list_messages(session: AsyncSession, thread_id: uuid.UUID) -> list[ChatMessage]:
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
        .order_by(ChatMessage.created_at.asc())
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())
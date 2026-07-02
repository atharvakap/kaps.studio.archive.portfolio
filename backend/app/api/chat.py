from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# 1. UPDATED IMPORT: Using get_db instead of get_session
from app.database.session import get_db 
from app.services import chat_service
from app.schemas.chat import (
    VisitorCreate, VisitorResponse,
    ThreadCreate, ThreadResponse,
    MessageResponse
)

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("/visitor", response_model=VisitorResponse)
async def create_visitor(
    visitor: VisitorCreate, 
    session: AsyncSession = Depends(get_db)  # <-- Updated here
):
    """Identifies a new visitor and returns their UUID."""
    return await chat_service.create_visitor(session, name=visitor.name, email=visitor.email)

@router.post("/thread", response_model=ThreadResponse)
async def create_thread(
    thread: ThreadCreate, 
    session: AsyncSession = Depends(get_db)  # <-- Updated here
):
    """Creates a new conversation thread for a visitor."""
    visitor = await chat_service.get_visitor(session, thread.visitor_id)
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    # Bump the visitor's last active timestamp since they are interacting
    await chat_service.update_last_active(session, thread.visitor_id)
    return await chat_service.create_thread(session, visitor_id=thread.visitor_id, title=thread.title)

@router.get("/threads/{visitor_id}", response_model=list[ThreadResponse])
async def list_threads(
    visitor_id: UUID, 
    session: AsyncSession = Depends(get_db)  # <-- Updated here
):
    """Retrieves all threads for a specific visitor, ordered by most recent."""
    return await chat_service.list_threads(session, visitor_id)

@router.get("/thread/{thread_id}", response_model=ThreadResponse)
async def get_thread(
    thread_id: UUID, 
    session: AsyncSession = Depends(get_db)  # <-- Updated here
):
    """Retrieves metadata for a specific thread."""
    thread = await chat_service.get_thread(session, thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread

@router.get("/thread/{thread_id}/messages", response_model=list[MessageResponse])
async def list_messages(
    thread_id: UUID, 
    session: AsyncSession = Depends(get_db)  # <-- Updated here
):
    """Retrieves the full conversation history for a specific thread."""
    thread = await chat_service.get_thread(session, thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    return await chat_service.list_messages(session, thread_id)
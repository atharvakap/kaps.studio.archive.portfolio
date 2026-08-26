from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.assistant.service import generate_response_stream
from app.database.session import get_db
from app.schemas.voice import (
    VoiceClientEventCreate,
    VoiceInterruptCreate,
    VoiceSessionClosedResponse,
    VoiceSessionCreate,
    VoiceSessionResponse,
    VoiceTurnCreate,
)
from app.services import chat_service
from app.voice.errors import VoiceError
from app.voice.orchestrator import VoiceOrchestrator
from app.voice.providers import OpenAIRealtimeProvider

router = APIRouter(prefix="/api/voice", tags=["Voice"])

voice_orchestrator = VoiceOrchestrator(provider=OpenAIRealtimeProvider.from_settings())


@router.post("/sessions", response_model=VoiceSessionResponse)
async def create_voice_session(
    request: VoiceSessionCreate,
    session: AsyncSession = Depends(get_db),
):
    thread = await chat_service.get_thread(session, request.thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    if thread.visitor_id != request.visitor_id:
        raise HTTPException(status_code=403, detail="Voice session cannot access this thread")

    try:
        voice_session, answer = await voice_orchestrator.create_session(
            visitor_id=request.visitor_id,
            thread_id=request.thread_id,
            offer_sdp=request.sdp,
        )
    except VoiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.user_message) from exc

    return VoiceSessionResponse(
        id=voice_session.id,
        provider=voice_session.provider,
        provider_session_id=voice_session.provider_session_id,
        state=voice_session.state,
        sdp=answer.sdp,
        model=answer.model,
        voice=answer.voice,
    )


@router.post("/sessions/{voice_session_id}/turn")
async def process_voice_turn(
    voice_session_id: UUID,
    request: VoiceTurnCreate,
    session: AsyncSession = Depends(get_db),
):
    try:
        turn = voice_orchestrator.begin_turn(
            session_id=voice_session_id,
            thread_id=request.thread_id,
            transcript=request.transcript,
            provider_item_id=request.provider_item_id,
        )
    except VoiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.user_message) from exc

    async def stream():
        async for chunk in voice_orchestrator.process_turn_stream(
            session_id=voice_session_id,
            turn_id=turn.id,
            db_session=session,
            assistant_streamer=generate_response_stream,
        ):
            yield chunk

    return StreamingResponse(
        stream(),
        media_type="text/plain",
        headers={"X-Voice-Turn-Id": str(turn.id)},
    )


@router.post("/sessions/{voice_session_id}/events")
async def record_voice_client_event(
    voice_session_id: UUID,
    request: VoiceClientEventCreate,
):
    try:
        voice_orchestrator.record_client_event(
            session_id=voice_session_id,
            event_name=request.event_name,
            turn_id=request.turn_id,
            metadata=request.metadata,
        )
    except VoiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.user_message) from exc

    return {"status": "ok"}


@router.post("/sessions/{voice_session_id}/interrupt")
async def interrupt_voice_turn(
    voice_session_id: UUID,
    request: VoiceInterruptCreate,
):
    try:
        voice_orchestrator.interrupt_turn(
            session_id=voice_session_id,
            turn_id=request.turn_id,
            reason=request.reason,
        )
    except VoiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.user_message) from exc

    return {"status": "interrupted"}


@router.delete("/sessions/{voice_session_id}", response_model=VoiceSessionClosedResponse)
async def close_voice_session(voice_session_id: UUID):
    try:
        voice_session = await voice_orchestrator.close_session(voice_session_id)
    except VoiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.user_message) from exc

    return VoiceSessionClosedResponse(id=voice_session.id, state=voice_session.state)

import uuid
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from app.assistant.agent import virtual_me_agent
from app.assistant.context import build_context_block
from app.logging import logger
from app.retrieval.pipeline import retrieve
from app.services import chat_service
from app.models.chat_message import MessageRole

# The definitive fallback response when no context is found.
NO_CONTEXT_FALLBACK = (
    "I don't have enough information about Atharva's portfolio to answer that accurately. "
    "Please try asking about his experience, projects, or technical skills!"
)

async def generate_response_stream(
    query: str, 
    thread_id: uuid.UUID, 
    session: AsyncSession
) -> AsyncGenerator[str, None]:
    """
    Orchestrates the complete Virtual Me flow with Conversation Memory.
    Saves messages to the database and injects history into the LLM prompt.
    """
    logger.info("virtual_me_streaming_started", query=query, thread_id=str(thread_id))

    try:
        # 1. Validate the thread exists
        thread = await chat_service.get_thread(session, thread_id)
        if not thread:
            yield "Error: Conversation thread not found."
            return

        # 2. Persist the User's message to the database immediately
        await chat_service.add_message(session, thread_id, MessageRole.user, query)

        # 3. Permanently rename the thread from "New Conversation" to match the user's prompt
        if thread.title == "New Conversation":
            new_title = query[:30] + "..." if len(query) > 30 else query
            thread.title = new_title
            session.add(thread)
            await session.commit()

        # 4. Retrieve the absolute best chunks from the database
        # Kept at -1.0 to completely disable the threshold filter!
        retrieved_chunks = await retrieve(query, top_k=4, similarity_threshold=-1.0)

        # 5. THE GROUNDING CHECK
        if not retrieved_chunks:
            logger.info("grounding_failed_no_context", query=query)
            yield NO_CONTEXT_FALLBACK
            # Persist the fallback as the assistant's official response
            await chat_service.add_message(session, thread_id, MessageRole.assistant, NO_CONTEXT_FALLBACK)
            return

        # 6. Format the database chunks into a readable string
        context_block = build_context_block(retrieved_chunks)
        
        # 7. Build the Memory Block
        # Fetch previous messages to give Virtual Me context for follow-up questions
        previous_messages = await chat_service.list_messages(session, thread_id)
        history_text = "--- Conversation History ---\n"
        
        # Grab the last 6 messages (excluding the one we just inserted) to keep context tight
        for msg in previous_messages[-7:-1]:
            role_name = "User" if msg.role == MessageRole.user else "Virtual Me"
            history_text += f"{role_name}: {msg.content}\n"
        
        # 8. Construct the final grounded prompt
        grounded_prompt = (
            f"Here is the retrieved context from Atharva's database:\n\n"
            f"{context_block}\n\n"
            f"{history_text}\n\n"
            f"Current User Question: {query}\n\n"
            f"Please answer the current question accurately and authentically using ONLY the retrieved context. Use the Conversation History to understand follow-up references."
        )

        logger.info("grounding_successful_streaming_response", chunk_count=len(retrieved_chunks))

        # 9. Invoke PydanticAI and capture the full response as it streams
        full_assistant_response = ""
        async with virtual_me_agent.run_stream(grounded_prompt) as result:
            async for chunk in result.stream_text(delta=True):
                full_assistant_response += chunk
                yield chunk

        # 10. Check if the resume tool was triggered during the agent execution
        tool_data = None
        for message in result.all_messages():
            if hasattr(message, "parts"):
                for part in message.parts:
                    if (
                        part.part_kind == "tool-return"
                        and isinstance(part.content, dict)
                        and part.content.get("type") == "resume"
                    ):
                        tool_data = part.content

        # 11. Persist the fully compiled Assistant message to the database with proper typing & metadata
        if tool_data:
            await chat_service.add_message(
                session=session,
                thread_id=thread_id,
                role=MessageRole.assistant,
                content="Here is my latest resume:",
                message_type="attachment",
                metadata={
                    "type": "resume",
                    "title": tool_data["title"],
                    "url": tool_data["url"],
                    "version": tool_data["version"]
                }
            )
        else:
            await chat_service.add_message(
                session=session, 
                thread_id=thread_id, 
                role=MessageRole.assistant, 
                content=full_assistant_response,
                message_type="text",
                metadata=None
            )
            
        logger.info("virtual_me_streaming_completed")

    except Exception as e:
        logger.error("virtual_me_streaming_failed", query=query, error=str(e))
        error_msg = "I encountered a technical error while searching my knowledge base."
        yield error_msg
        await chat_service.add_message(session, thread_id, MessageRole.assistant, error_msg)
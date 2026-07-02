from typing import AsyncGenerator

from app.assistant.agent import virtual_me_agent
from app.assistant.context import build_context_block
from app.logging import logger
from app.retrieval.pipeline import retrieve

# The definitive fallback response when no context is found.
NO_CONTEXT_FALLBACK = (
    "I don't have enough information about Atharva's portfolio to answer that accurately. "
    "Please try asking about his experience, projects, or technical skills!"
)

async def generate_response_stream(query: str) -> AsyncGenerator[str, None]:
    """
    Orchestrates the complete Virtual Me flow and streams the response token-by-token.
    Enforces strict grounding: if no context is retrieved, the LLM is short-circuited.
    """
    logger.info("virtual_me_streaming_started", query=query)

    try:
        # 1. Retrieve the absolute best chunks from the database
        # Lowered to 0.0 to guarantee it grabs the top 4 matches regardless of conversational filler!
        retrieved_chunks = await retrieve(query, top_k=4, similarity_threshold=0.0)

        # 2. THE GROUNDING CHECK
        if not retrieved_chunks:
            logger.info("grounding_failed_no_context", query=query)
            # We still yield it so the frontend can receive it like a normal stream
            yield NO_CONTEXT_FALLBACK
            return

        # 3. Format the database chunks into a readable string
        context_block = build_context_block(retrieved_chunks)
        
        # 4. Construct the final grounded prompt
        grounded_prompt = (
            f"Here is the retrieved context from Atharva's database:\n\n"
            f"{context_block}\n\n"
            f"User Question: {query}\n\n"
            f"Please answer the question accurately and authentically using ONLY the context provided above."
        )

        logger.info("grounding_successful_streaming_response", chunk_count=len(retrieved_chunks))

        # 5. Invoke PydanticAI and stream the tokens!
        # delta=True ensures we only yield the *new* word, rather than re-sending the whole sentence
        async with virtual_me_agent.run_stream(grounded_prompt) as result:
            async for chunk in result.stream_text(delta=True):
                yield chunk

        logger.info("virtual_me_streaming_completed")

    except Exception as e:
        logger.error("virtual_me_streaming_failed", query=query, error=str(e))
        yield "I encountered a technical error while searching my knowledge base."
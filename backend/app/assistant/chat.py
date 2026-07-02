from app.logging import logger
from app.retrieval.pipeline import retrieve
from app.assistant.agent import virtual_me_agent
from app.assistant.context import build_context_block

# The definitive fallback response when no context is found.
NO_CONTEXT_FALLBACK = (
    "I don't have enough information about Atharva's portfolio to answer that accurately. "
    "Please try asking about his experience, projects, or technical skills!"
)

async def generate_response(query: str) -> str:
    """
    Orchestrates the end-to-end Virtual Me flow.
    Enforces strict grounding: if no context is retrieved, the LLM is short-circuited.
    """
    logger.info("virtual_me_processing_started", query=query)

    try:
        # 1. Retrieve the absolute best chunks from the database
        # We use a lower threshold (0.2) to ensure Vector Search brings in conceptual matches
        retrieved_chunks = await retrieve(query, top_k=4, similarity_threshold=0.2)

        # 2. THE GROUNDING CHECK (Phase 8, Step 4)
        # If the database returns absolutely nothing, we do NOT call OpenAI.
        # This completely eliminates the risk of hallucination.
        if not retrieved_chunks:
            logger.info("grounding_failed_no_context", query=query)
            return NO_CONTEXT_FALLBACK

        # 3. Format the database chunks into a readable string
        context_block = build_context_block(retrieved_chunks)
        
        logger.info("grounding_successful", chunk_count=len(retrieved_chunks))

        # 4. (Placeholder for Step 5) 
        # We have the context and we know it's valid. In the next step, we will wire up 
        # the PydanticAI agent to actually read this context and stream a response!
        return f"[System: Grounding Check Passed! Found {len(retrieved_chunks)} chunks. Ready to stream...]"

    except Exception as e:
        logger.error("virtual_me_processing_failed", query=query, error=str(e))
        return "I encountered a technical error while searching my knowledge base."
from app.logging import logger
from app.models.document_chunk import DocumentChunk


def build_context_block(retrieved_chunks: list[DocumentChunk]) -> str:
    """
    Takes a list of retrieved database chunks and formats them into a single, 
    clean string block to be injected into the LLM's prompt.
    """
    logger.info("building_context_block", chunk_count=len(retrieved_chunks))

    if not retrieved_chunks:
        return "No specific portfolio context was found for this query."

    context_parts = []
    
    for i, chunk in enumerate(retrieved_chunks, start=1):
        # We wrap each chunk in clear markdown dividers so the LLM 
        # can easily distinguish between different pieces of information.
        context_parts.append(
            f"--- Knowledge Document {i} ---\n"
            f"{chunk.content.strip()}\n"
        )

    # Join all the formatted chunks together with a double newline
    final_context = "\n".join(context_parts)
    
    return final_context
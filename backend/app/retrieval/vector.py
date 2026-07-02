from sqlalchemy import select

from app.assistant.embeddings import generate_embedding
from app.database.session import AsyncSessionLocal
from app.logging import logger
from app.models.document_chunk import DocumentChunk


async def embed_query(query: str) -> list[float]:
    """
    Takes a user's raw text question and converts it into a 1536-dimensional 
    vector using the same OpenAI model used in Phase 6.
    """
    logger.info("embed_query_started", query=query)
    try:
        # Re-use our existing OpenAI embedding client
        return await generate_embedding(query)
    except Exception as e:
        logger.error("embed_query_failed", query=query, error=str(e))
        raise


async def similarity_search(
    query_embedding: list[float], 
    top_k: int = 5, 
    similarity_threshold: float = 0.75
) -> list[DocumentChunk]:
    """
    Queries the document_chunks table using pgvector's cosine distance.
    Returns the top_k most semantically similar chunks.
    """
    logger.info(
        "similarity_search_started", 
        top_k=top_k, 
        similarity_threshold=similarity_threshold
    )
    
    try:
        # pgvector uses Cosine Distance (0 = identical, 2 = opposites).
        # To filter by a Similarity Threshold (e.g., 0.75), we convert it:
        # Distance Threshold = 1.0 - Similarity
        distance_threshold = 1.0 - similarity_threshold

        async with AsyncSessionLocal() as session:
            # The <=> operator in SQLAlchemy/pgvector represents Cosine Distance
            distance_expr = DocumentChunk.embedding.cosine_distance(query_embedding)
            
            stmt = (
                select(DocumentChunk)
                .where(distance_expr <= distance_threshold)
                .order_by(distance_expr)
                .limit(top_k)
            )
            
            result = await session.execute(stmt)
            retrieved_chunks = result.scalars().all()
            
            logger.info("similarity_search_completed", retrieved_count=len(retrieved_chunks))
            return list(retrieved_chunks)

    except Exception as e:
        logger.error("similarity_search_failed", error=str(e))
        raise
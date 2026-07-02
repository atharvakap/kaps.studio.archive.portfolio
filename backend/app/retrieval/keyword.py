from sqlalchemy import select, func

from app.database.session import AsyncSessionLocal
from app.logging import logger
from app.models.document_chunk import DocumentChunk


async def keyword_search(query: str, top_k: int = 5) -> list[DocumentChunk]:
    """
    Queries the document_chunks table using PostgreSQL's native Full Text Search.
    Returns the top_k chunks that contain exact or stemmed keyword matches.
    """
    logger.info("keyword_search_started", query=query, top_k=top_k)

    try:
        async with AsyncSessionLocal() as session:
            # 1. Convert the content into a searchable PostgreSQL vector
            # 'english' ensures it understands root words (e.g., 'running' matches 'run')
            ts_vector = func.to_tsvector("english", DocumentChunk.content)
            
            # 2. Convert the user's raw query into a smart PostgreSQL search query
            # websearch_to_tsquery gracefully handles normal, messy human sentences
            ts_query = func.websearch_to_tsquery("english", query)
            
            # 3. Calculate the relevance rank of the match
            rank = func.ts_rank(ts_vector, ts_query)

            # 4. Execute the search
            stmt = (
                select(DocumentChunk)
                .where(ts_vector.op("@@")(ts_query))  # @@ means "matches"
                .order_by(rank.desc())
                .limit(top_k)
            )

            result = await session.execute(stmt)
            retrieved_chunks = result.scalars().all()

            logger.info("keyword_search_completed", retrieved_count=len(retrieved_chunks))
            return list(retrieved_chunks)

    except Exception as e:
        logger.error("keyword_search_failed", error=str(e), query=query)
        raise
import asyncio

from app.logging import logger
from app.models.document_chunk import DocumentChunk
from app.retrieval.keyword import keyword_search
from app.retrieval.rrf import reciprocal_rank_fusion
from app.retrieval.vector import embed_query, similarity_search


async def retrieve(
    query: str, 
    top_k: int = 5, 
    rrf_k: int = 60, 
    similarity_threshold: float = 0.5
) -> list[DocumentChunk]:
    """
    Orchestrates the Hybrid Retrieval pipeline:
    1. Embeds the user query.
    2. Executes Vector and Keyword searches concurrently for maximum speed.
    3. Fuses the results using Reciprocal Rank Fusion (RRF).
    """
    logger.info("retrieval_pipeline_started", query=query)

    try:
        # 1. Generate the query embedding first (since Vector Search relies on it)
        query_embedding = await embed_query(query)

        # 2. Run both searches concurrently! 
        # asyncio.gather fires both functions off at the same time and waits for both to finish.
        vector_task = similarity_search(
            query_embedding, top_k=top_k, similarity_threshold=similarity_threshold
        )
        keyword_task = keyword_search(query, top_k=top_k)

        vector_results, keyword_results = await asyncio.gather(vector_task, keyword_task)

        # 3. Fuse the results together using RRF
        fused_chunks = reciprocal_rank_fusion(
            vector_results=vector_results,
            keyword_results=keyword_results,
            k=rrf_k
        )

        # 4. Trim the final list down to the absolute best top_k chunks
        final_results = fused_chunks[:top_k]

        logger.info("retrieval_pipeline_completed", final_count=len(final_results))
        return final_results

    except Exception as e:
        logger.error("retrieval_pipeline_failed", query=query, error=str(e))
        raise
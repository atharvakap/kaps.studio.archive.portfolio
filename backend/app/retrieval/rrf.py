from app.logging import logger
from app.models.document_chunk import DocumentChunk

def reciprocal_rank_fusion(
    vector_results: list[DocumentChunk],
    keyword_results: list[DocumentChunk],
    k: int = 60,
) -> list[DocumentChunk]:
    """
    Fuses the ranked outputs from vector search and keyword search into a 
    single deterministic ranking using the RRF algorithm.
    """
    logger.info(
        "rrf_started", 
        vector_count=len(vector_results), 
        keyword_count=len(keyword_results),
        k=k
    )

    # Dictionary to track the fused scores mapped to chunk ID strings
    fused_scores: dict[str, float] = {}
    
    # Dictionary to hold the actual chunk objects so we can return them later
    unique_chunks: dict[str, DocumentChunk] = {}

    # 1. Process Vector Results
    for rank, chunk in enumerate(vector_results, start=1):
        chunk_id = str(chunk.id)
        if chunk_id not in fused_scores:
            fused_scores[chunk_id] = 0.0
            unique_chunks[chunk_id] = chunk
            
        # The RRF Formula: score += 1 / (k + rank)
        fused_scores[chunk_id] += 1.0 / (k + rank)

    # 2. Process Keyword Results
    for rank, chunk in enumerate(keyword_results, start=1):
        chunk_id = str(chunk.id)
        if chunk_id not in fused_scores:
            fused_scores[chunk_id] = 0.0
            unique_chunks[chunk_id] = chunk
            
        fused_scores[chunk_id] += 1.0 / (k + rank)

    # 3. Sort chunks by their fused score (descending)
    # Python's built-in sorted() is stable, meaning it naturally uses 
    # the first appearance order as a tie-breaker if scores are perfectly identical!
    sorted_chunk_ids = sorted(
        fused_scores.keys(),
        key=lambda cid: fused_scores[cid],
        reverse=True
    )

    # 4. Rebuild the final list of chunks in their new fused order
    fused_results = [unique_chunks[cid] for cid in sorted_chunk_ids]

    logger.info("rrf_completed", final_fused_count=len(fused_results))
    return fused_results
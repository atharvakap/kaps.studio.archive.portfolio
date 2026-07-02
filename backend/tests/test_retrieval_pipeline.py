import pytest
import uuid
from unittest.mock import AsyncMock, patch

from app.models.document_chunk import DocumentChunk
from app.retrieval.pipeline import retrieve

@pytest.mark.asyncio
@patch("app.retrieval.pipeline.embed_query", new_callable=AsyncMock)
@patch("app.retrieval.pipeline.similarity_search", new_callable=AsyncMock)
@patch("app.retrieval.pipeline.keyword_search", new_callable=AsyncMock)
@patch("app.retrieval.pipeline.reciprocal_rank_fusion")
async def test_retrieve_pipeline_orchestration(
    mock_rrf, mock_keyword, mock_vector, mock_embed
):
    """
    Tests that the retrieval pipeline correctly orchestrates:
    1. Embedding generation
    2. Concurrent Vector & Keyword searches
    3. RRF Fusion
    4. Trimming to top_k
    """
    
    # 1. Setup Mock Returns
    mock_embed.return_value = [0.1, 0.2, 0.3]  # Fake vector
    
    fake_chunk = DocumentChunk(id=uuid.uuid4(), content="Mocked Chunk")
    mock_vector.return_value = [fake_chunk]
    mock_keyword.return_value = [fake_chunk]
    
    # RRF returns a list of 10 fake chunks, but we only ask for top_k=2
    mock_rrf.return_value = [fake_chunk for _ in range(10)]

    # 2. Execute
    query = "What is the tech stack?"
    results = await retrieve(query, top_k=2)

    # 3. Assertions
    # Did it trim the 10 RRF results down to the top 2?
    assert len(results) == 2

    # Did it call the embedding service exactly once with the raw query?
    mock_embed.assert_called_once_with(query)
    
    # Did it fire off both searches?
    mock_vector.assert_called_once_with(
        mock_embed.return_value, top_k=2, similarity_threshold=0.5
    )
    mock_keyword.assert_called_once_with(query, top_k=2)
    
    # Did it pass the results to RRF?
    mock_rrf.assert_called_once_with(
        vector_results=mock_vector.return_value,
        keyword_results=mock_keyword.return_value,
        k=60
    )
import uuid
from app.models.document_chunk import DocumentChunk
from app.retrieval.rrf import reciprocal_rank_fusion

def test_rrf_merges_and_boosts_duplicates():
    """Test that chunks found in both searches get a massive rank boost and are deduplicated."""
    
    # 1. Create fake chunks
    chunk_a = DocumentChunk(id=uuid.uuid4(), content="Conceptual Match")
    chunk_b = DocumentChunk(id=uuid.uuid4(), content="The Ultimate Match (Found in both)")
    chunk_c = DocumentChunk(id=uuid.uuid4(), content="Exact Keyword Match")

    # 2. Simulate Vector Search finding A then B
    vector_results = [chunk_a, chunk_b]
    
    # 3. Simulate Keyword Search finding B then C
    keyword_results = [chunk_b, chunk_c]

    # 4. Run the fusion!
    fused = reciprocal_rank_fusion(vector_results, keyword_results, k=60)

    # 5. Assertions
    assert len(fused) == 3  # Should perfectly deduplicate the 4 inputs into 3 unique chunks
    
    # Chunk B was rank 2 in both, meaning its combined score (1/62 + 1/62 = 0.032) 
    # beats Chunk A's single rank 1 score (1/61 = 0.016). B should win!
    assert fused[0].id == chunk_b.id
    
    # Chunk A (Vector Rank 1) should beat Chunk C (Keyword Rank 2)
    assert fused[1].id == chunk_a.id
    assert fused[2].id == chunk_c.id


def test_rrf_stable_tie_breaker():
    """Test that perfectly identical scores resolve deterministically based on first appearance."""
    
    chunk_x = DocumentChunk(id=uuid.uuid4(), content="Vector Match")
    chunk_y = DocumentChunk(id=uuid.uuid4(), content="Keyword Match")

    vector_results = [chunk_x]
    keyword_results = [chunk_y]

    fused = reciprocal_rank_fusion(vector_results, keyword_results, k=60)

    # Both have a rank of 1, so scores are identical. 
    # Because Vector Results are processed first in our algorithm, X should win the tie.
    assert fused[0].id == chunk_x.id
    assert fused[1].id == chunk_y.id
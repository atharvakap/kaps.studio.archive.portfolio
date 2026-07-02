import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.database.session import AsyncSessionLocal
from app.models.document_chunk import DocumentChunk
from app.models.knowledge_document import KnowledgeDocument
from app.services.embedding_service import embedding_service


@pytest.mark.asyncio
async def test_embedding_workflow_e2e():
    """
    Validates the end-to-end embedding workflow:
    1. Normal run (populates empty chunks)
    2. Skip run (ignores already populated chunks)
    3. Force run (overwrites existing chunks)
    """
    # 1. Setup: Create a temporary document and chunk in the database
    async with AsyncSessionLocal() as session:
        doc_id = uuid.uuid4()
        chunk_id = uuid.uuid4()

        doc = KnowledgeDocument(
            id=doc_id, title="Test Doc for Embeddings", source_type="test", content="Full content"
        )
        session.add(doc)

        chunk = DocumentChunk(
            id=chunk_id,
            document_id=doc_id,
            content="This is a test chunk that needs an embedding.",
            chunk_index=0,
            meta_data={"test": "data"},
        )
        session.add(chunk)
        await session.commit()

    # 2. Create a fake vector matching OpenAI's 1536 dimensions
    fake_vector = [0.1] * 1536

    # 3. Intercept the OpenAI call to save money and time
    with patch(
        "app.services.embedding_service.generate_embedding", new_callable=AsyncMock
    ) as mock_embed:
        mock_embed.return_value = fake_vector

        # --- SCENARIO 1: Normal Run ---
        results = await embedding_service.process_chunks(force=False)
        assert len(results) >= 1

        # Verify it actually saved to Supabase
        async with AsyncSessionLocal() as session:
            db_chunk = await session.get(DocumentChunk, chunk_id)
            assert db_chunk.embedding is not None
            assert len(db_chunk.embedding) == 1536

        mock_embed.reset_mock()

        # --- SCENARIO 2: Skip Existing ---
        # Running it again should result in 0 new chunks being processed
        results_skip = await embedding_service.process_chunks(force=False)

        # Filter for our specific chunk ID in case other tests left dirty data
        our_skip_results = [r for r in results_skip if r.chunk_id == chunk_id]
        assert len(our_skip_results) == 0
        mock_embed.assert_not_called()

        # --- SCENARIO 3: Force Refresh ---
        # Provide a NEW fake vector to prove it overwrites
        mock_embed.return_value = [0.9] * 1536
        results_force = await embedding_service.process_chunks(force=True)

        our_force_result = next(r for r in results_force if r.chunk_id == chunk_id)
        assert our_force_result.metadata["status"] == "success"

        # Verify the database was updated with the new vector
        async with AsyncSessionLocal() as session:
            db_chunk_updated = await session.get(DocumentChunk, chunk_id)
            assert db_chunk_updated.embedding[0] == 0.9

    # 4. Teardown: Clean up the database
    async with AsyncSessionLocal() as session:
        doc_to_delete = await session.get(KnowledgeDocument, doc_id)
        if doc_to_delete:
            await session.delete(doc_to_delete)
            await session.commit()

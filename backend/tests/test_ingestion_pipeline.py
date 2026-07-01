from unittest.mock import AsyncMock, patch

import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database.session import AsyncSessionLocal
from app.ingestion.parser import ParsedDocument
from app.ingestion.pipeline import IngestionPipeline
from app.models.knowledge_document import KnowledgeDocument


@pytest.mark.asyncio
async def test_ingestion_pipeline_e2e():
    """
    Verifies the complete ingestion workflow: parsing (mocked),
    semantic chunking, metadata extraction, and database persistence.
    """
    # 1. Prepare a fake parsed document with Markdown headers to test the chunker
    fake_markdown = (
        "# My Resume\n\n"
        "This is an intro paragraph that should be chunked.\n\n"
        "## Experience\n\n"
        "I worked as a software engineer, building cool things."
    )
    fake_parsed_doc = ParsedDocument(
        title="Test Resume",
        content=fake_markdown,
        source_type="resume",
        metadata={"parser": "mocked", "original_length": len(fake_markdown)},
    )

    # 2. Patch Docling to avoid heavy PDF parsing during fast unit tests
    with patch("app.ingestion.pipeline.docling_parser.parse", new_callable=AsyncMock) as mock_parse:
        mock_parse.return_value = fake_parsed_doc

        # 3. Execute the pipeline
        pipeline = IngestionPipeline()
        success = await pipeline.ingest(
            title="Test Resume", source_type="resume", raw_document="fake_path_or_string"
        )

        assert success is True
        mock_parse.assert_called_once()

    # 4. Verify Database Persistence and Orchestration Logic
    async with AsyncSessionLocal() as session:
        # Fetch the document and eager-load its chunks
        stmt = (
            select(KnowledgeDocument)
            .where(KnowledgeDocument.title == "Test Resume")
            .options(selectinload(KnowledgeDocument.chunks))
        )
        result = await session.execute(stmt)
        document = result.scalars().first()

        # Assert the parent document saved correctly
        assert document is not None
        assert document.source_type == "resume"
        assert document.content == fake_markdown

        # Assert the chunks generated and saved correctly
        chunks = document.chunks
        assert len(chunks) > 0

        first_chunk = chunks[0]
        assert first_chunk.content != ""
        assert first_chunk.chunk_index == 0

        # PROOF: The embedding should be completely blank (Phase 6 responsibility)
        assert first_chunk.embedding is None

        # Assert the metadata extractor worked
        assert "document_title" in first_chunk.meta_data
        assert first_chunk.meta_data["document_title"] == "Test Resume"

        # Assert the semantic chunker detected the heading
        # Depending on how the chunker split the fake_markdown, one of the chunks
        # should have tracked the 'Experience' section.
        sections_found = [c.meta_data.get("section") for c in chunks]
        assert "Experience" in sections_found

        # 5. Cleanup the database so the next test run is clean
        await session.delete(document)
        await session.commit()

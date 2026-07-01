from typing import Any

from app.logging import logger


class MetadataExtractor:
    """
    Enriches semantic chunks with document-level context and structural metadata.
    No expensive AI operations happen here—just data organization.
    """

    async def extract_and_attach(
        self,
        chunks: list[dict[str, Any]],
        document_title: str,
        source_type: str,
        document_metadata: dict[str, Any],
    ) -> list[dict[str, Any]]:

        logger.info("metadata_extraction_started", chunk_count=len(chunks))
        total_chunks = len(chunks)

        for chunk in chunks:
            # Retrieve the structural metadata (like 'section') added by the chunker
            chunk_meta = chunk.get("metadata", {})

            # Enrich with document-wide context
            chunk_meta.update(
                {
                    "document_title": document_title,
                    "source_type": source_type,
                    "chunk_index": chunk.get("chunk_index", 0),
                    "total_chunks": total_chunks,
                    "parser": document_metadata.get("parser", "unknown"),
                }
            )

            # Re-assign the enriched metadata to the chunk
            chunk["metadata"] = chunk_meta

        logger.info("metadata_extraction_completed")
        return chunks


# Create a singleton instance
metadata_extractor = MetadataExtractor()


# The wrapper function our IngestionPipeline expects
async def extract_metadata(
    chunks: list[dict[str, Any]], title: str, source_type: str, doc_meta: dict[str, Any]
) -> list[dict[str, Any]]:
    return await metadata_extractor.extract_and_attach(chunks, title, source_type, doc_meta)

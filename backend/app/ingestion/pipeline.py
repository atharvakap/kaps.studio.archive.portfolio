from app.ingestion.chunker import chunk_document
from app.ingestion.docling_parser import docling_parser
from app.ingestion.metadata import extract_metadata
from app.ingestion.persistence import persist
from app.logging import logger


class IngestionPipeline:
    """
    Orchestrates the conversion of a raw source document into structured,
    embedded knowledge in the database.
    """

    async def ingest(self, title: str, source_type: str, raw_document: str) -> bool:
        """
        Executes the full ingestion workflow.
        """
        logger.info("starting_ingestion_pipeline", title=title, source_type=source_type)

        try:
            # 1. Parse using Docling (Returns a normalized ParsedDocument object)
            parsed_doc = await docling_parser.parse(
                raw_content=raw_document, source_type=source_type, title=title
            )

            # 2. Chunk (Pass only the clean content string to the chunker)
            chunks = await chunk_document(parsed_doc.content)

            # 3. Extract & Attach Metadata to chunks
            enriched_chunks = await extract_metadata(
                chunks=chunks,
                title=parsed_doc.title,
                source_type=parsed_doc.source_type,
                doc_meta=parsed_doc.metadata,
            )

            # 4. Persist (Updated signature ready for Step 6)
            success = await persist(
                title=parsed_doc.title,
                source_type=parsed_doc.source_type,
                content=parsed_doc.content,
                chunks=enriched_chunks,
            )

            logger.info("ingestion_pipeline_completed", title=title, success=success)
            return success

        except Exception as e:
            logger.error("ingestion_pipeline_failed", title=title, error=str(e))
            raise

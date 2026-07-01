from typing import Any

from sqlalchemy.exc import SQLAlchemyError

from app.database.session import AsyncSessionLocal
from app.logging import logger
from app.models.document_chunk import DocumentChunk
from app.models.knowledge_document import KnowledgeDocument


async def persist(title: str, source_type: str, content: str, chunks: list[dict[str, Any]]) -> bool:
    """
    Saves the parsed document and its enriched chunks to PostgreSQL.
    Leaves the embedding field empty for now (Phase 6 responsibility).
    """
    logger.info("persisting_knowledge_started", title=title, chunk_count=len(chunks))

    try:
        # We instantiate our own session here because this pipeline
        # might run in the background outside of an active FastAPI HTTP request
        async with AsyncSessionLocal() as session:
            # 1. Create the parent KnowledgeDocument
            document = KnowledgeDocument(title=title, source_type=source_type, content=content)
            session.add(document)

            # Flush sends the insert to the DB so we get the 'document.id' back,
            # but doesn't commit the transaction permanently yet
            await session.flush()

            # 2. Create the child DocumentChunk records
            db_chunks = []
            for chunk_data in chunks:
                db_chunk = DocumentChunk(
                    document_id=document.id,
                    content=chunk_data["content"],
                    chunk_index=chunk_data["chunk_index"],
                    meta_data=chunk_data["metadata"],
                    # Notice we are intentionally NOT setting 'embedding'
                )
                db_chunks.append(db_chunk)

            # 3. Add all chunks in bulk
            session.add_all(db_chunks)

            # 4. Commit the transaction to save everything at once atomically
            await session.commit()

            logger.info("persisting_knowledge_completed", document_id=str(document.id))
            return True

    except SQLAlchemyError as e:
        logger.error("persisting_knowledge_failed_db", title=title, error=str(e))
        raise ValueError(f"Database persistence failed: {str(e)}")
    except Exception as e:
        logger.error("persisting_knowledge_failed_unknown", title=title, error=str(e))
        raise

import asyncio
import sys
from pathlib import Path

from app.ingestion.pipeline import IngestionPipeline
from app.services.embedding_service import embedding_service


async def main():
    # 1. Dynamically resolve the absolute path to the knowledge folder
    backend_dir = Path(__file__).resolve().parent
    knowledge_dir = backend_dir.parent / "knowledge"

    print(f"Looking for documents in: {knowledge_dir}")

    if not knowledge_dir.exists():
        print("Knowledge folder not found! Please check your directory structure.")
        return

    # 2. PHASE 5: Ingest all documents from the knowledge folder
    print("\n--- STARTING INGESTION PHASE ---")
    pipeline = IngestionPipeline()

    # Use rglob (recursive glob) to search all subfolders (like /raw)
    md_files = list(knowledge_dir.rglob("*.md"))
    pdf_files = list(knowledge_dir.rglob("*.pdf"))
    doc_files = md_files + pdf_files

    print(f"Found {len(doc_files)} documents to ingest.")

    for file_path in doc_files:
        print(f"Ingesting and chunking: {file_path.name}...")

        # We use the file name (without extension) as the title
        title = file_path.stem.replace("_", " ").title()

        # Dynamically determine the valid source_type for your parser
        ext = file_path.suffix.lower()
        if ext == ".pdf":
            doc_format = "pdf"
        else:
            doc_format = "markdown"

        # Pass the absolute string path to your Docling parser
        await pipeline.ingest(
            title=title,
            source_type=doc_format,  # <-- This uses the valid format now!
            raw_document=str(file_path),
        )

    print("Ingestion complete! Chunks are saved to PostgreSQL without vectors.")

    # 3. PHASE 6: Fire up the Embedding Pipeline
    print("\n--- STARTING EMBEDDING PHASE ---")
    print("Firing up the AI embedding service...")

    # Force=False means it will only embed the NEW chunks we just created
    results = await embedding_service.process_chunks(force=False)

    success_count = sum(1 for r in results if r.metadata.get("status") == "success")
    print(
        f"Processed {len(results)} chunks! "
        f"({success_count} successful vectors generated in Supabase)"
    )


if __name__ == "__main__":
    # Windows-specific fix for psycopg3 async event loop
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    asyncio.run(main())

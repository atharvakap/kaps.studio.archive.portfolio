import asyncio
import sys
from app.services.embedding_service import embedding_service

async def repair_brain():
    print("🧠 Repairing AI Brain... fetching REAL vectors from OpenAI!")
    # force=True tells it to overwrite the 0.9s with real OpenAI math!
    results = await embedding_service.process_chunks(force=True)
    
    success_count = sum(1 for r in results if r.metadata.get("status") == "success")
    print(f"✅ Brain restored! Successfully saved {success_count} real vectors.")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(repair_brain())
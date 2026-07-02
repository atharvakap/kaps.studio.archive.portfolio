import asyncio
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.database.session import AsyncSessionLocal
from app.services import analytics_service

async def main():
    print("📊 Fetching live analytics from PostgreSQL...\n")
    
    async with AsyncSessionLocal() as session:
        # Fetch the exact same report your React dashboard will request
        metrics = await analytics_service.get_overview_metrics(session)
        
        print("✅ Analytics Overview Generated:")
        print("-" * 40)
        print(json.dumps(metrics, indent=4))
        print("-" * 40)

if __name__ == "__main__":
    # Fix for Windows asyncio loop
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
import asyncio
import sys
from dotenv import load_dotenv

# Load the .env file BEFORE importing anything from PydanticAI!
load_dotenv()

from app.assistant.service import generate_response_stream
from app.database.session import AsyncSessionLocal
from app.services import chat_service

async def main():
    async with AsyncSessionLocal() as session:
        # 1. Create a dummy visitor and thread to act as our database container
        print("👤 Creating test visitor and thread...")
        visitor = await chat_service.create_visitor(session, name="Test User")
        thread = await chat_service.create_thread(session, visitor_id=visitor.id, title="Memory Test")
        
        # 2. Ask the primary question
        question1 = "Can you tell me about Atharva's experience with Salesforce?"
        print(f"\n🤖 User: '{question1}'")
        print("Virtual Me: ", end="", flush=True)
        
        async for token in generate_response_stream(question1, thread.id, session):
            print(token, end="", flush=True)
            
        # 3. Ask a pronoun-heavy follow-up question that REQUIRES memory!
        # If the AI has amnesia, it won't know what "his" or "frontend" refers to in this context.
        question2 = "What about his frontend skills?"
        print(f"\n\n🤖 User (Follow-up): '{question2}'")
        print("Virtual Me: ", end="", flush=True)
        
        async for token in generate_response_stream(question2, thread.id, session):
            print(token, end="", flush=True)

    print("\n\n✅ Stream & Memory Test Complete!")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
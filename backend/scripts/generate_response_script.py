import asyncio
import sys
import json
from dotenv import load_dotenv
from sqlalchemy import select

# Load environment variables FIRST
load_dotenv()

from app.database.session import AsyncSessionLocal
from app.services import analytics_service, chat_service
from app.models.resume import Resume
from app.models.contact_message import ContactMessage

# Import your actual AI streaming service
from app.assistant.service import generate_response_stream

async def main():
    print("🚀 Booting up the Ultimate Portfolio Simulation...\n")

    async with AsyncSessionLocal() as session:
        # ---------------------------------------------------------
        # 1. SIMULATE CHAT (Phase 9 & 10)
        # ---------------------------------------------------------
        print("💬 STEP 1: Simulating Real Chat Flow & Event Tracking...")
        visitor = await chat_service.create_visitor(session, name="Simulated Recruiter", email="recruiter@example.com")
        print(f"   ✅ Visitor created: {visitor.id}")

        thread = await chat_service.create_thread(session, visitor_id=visitor.id, title="Simulation Conversation")
        print(f"   ✅ Thread created (Fired 'thread_created' analytics event)")

        # ---------------------------------------------------------
        # THE AI INTEGRATION (Generates real response)
        # ---------------------------------------------------------
        question = "What are Atharva's frontend skills?"
        print(f"\n   👤 User: '{question}'")
        print("   🤖 Virtual Me: ", end="", flush=True)
        
        # This function internally saves the user message AND assistant message, 
        # which will fire both 'message_sent' and 'response_generated' events!
        async for token in generate_response_stream(question, thread.id, session):
            print(token, end="", flush=True)
            
        print("\n\n   ✅ AI response completed & saved to database!")

        # ---------------------------------------------------------
        # 2. SIMULATE CONTACT FORM (Phase 10)
        # ---------------------------------------------------------
        print("\n📬 STEP 2: Simulating Contact Form Submission...")
        try:
            # Using the corrected schema field names!
            new_contact = ContactMessage(
                sender_name="Jane Doe",
                sender_email="jane@example.com",
                subject="Freelance Project Inquiry",
                message="I would love to hire you for a freelance project!"
            )
            session.add(new_contact)
            await session.commit()
            await session.refresh(new_contact)

            # Manually trigger the analytics service like your route does
            await analytics_service.record_contact_submission(session, new_contact.id)
            print(f"   ✅ Contact Message Saved & Analytics Event Recorded!")
        except Exception as e:
            await session.rollback()
            print(f"   ⚠️ Could not simulate contact message: {e}")

        # ---------------------------------------------------------
        # 3. SIMULATE RESUME DOWNLOAD (Phase 10)
        # ---------------------------------------------------------
        print("\n📄 STEP 3: Simulating Resume Download...")
        try:
            # Fetch the first valid Resume ID for the foreign key
            result = await session.execute(select(Resume).limit(1))
            resume = result.scalar_one_or_none()

            if resume:
                await analytics_service.record_resume_download(
                    session, 
                    resume_id=resume.id, 
                    name="Simulated Recruiter", 
                    email="recruiter@example.com"
                )
                print(f"   ✅ Resume Download Recorded for Resume ID: {resume.id}")
            else:
                print("   ⚠️ No Resume found in the database. Skipping download tracking simulation.")
        except Exception as e:
            await session.rollback()
            print(f"   ⚠️ Could not simulate resume download: {e}")

        # ---------------------------------------------------------
        # 4. FETCH ANALYTICS OVERVIEW
        # ---------------------------------------------------------
        print("\n📊 STEP 4: Fetching Real-Time Analytics Dashboard...")
        metrics = await analytics_service.get_overview_metrics(session)

        print("\n" + "="*50)
        print("🏆 SIMULATION COMPLETE! LIVE DASHBOARD METRICS:")
        print("="*50)
        print(json.dumps(metrics, indent=4))
        print("="*50 + "\n")

if __name__ == "__main__":
    # Fix for Windows asyncio event loop
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(main())
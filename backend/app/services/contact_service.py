from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate

class ContactService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_contact_message(self, message_data: ContactMessageCreate) -> ContactMessage:
        """Create a new contact message."""
        new_message = ContactMessage(**message_data.model_dump())
        self.session.add(new_message)
        await self.session.commit()
        await self.session.refresh(new_message)
        return new_message

    async def get_contact_messages(self) -> Sequence[ContactMessage]:
        """Fetch all contact messages."""
        stmt = select(ContactMessage)
        result = await self.session.execute(stmt)
        return result.scalars().all()
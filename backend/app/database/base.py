# single SQLAlchemy Declarative Base.
# Every ORM model in the project will inherit from this base class.

from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

# Standard naming conventions for Alembic migrations
POSTGRES_NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=POSTGRES_NAMING_CONVENTION)

class Base(DeclarativeBase):
    """
    The master base class for all SQLAlchemy ORM models.
    """
    metadata = metadata
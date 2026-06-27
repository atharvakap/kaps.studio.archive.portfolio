# single SQLAlchemy Declarative Base.
# Every ORM model in the project will inherit from this base class.

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

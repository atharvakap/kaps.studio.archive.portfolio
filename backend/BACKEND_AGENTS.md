# Backend — Agent Notes

This is the FastAPI backend service for Portfolio 2.0.

Read ../AGENTS.md first.

Project-wide rules live there.

This document defines backend-specific conventions.

---

# Purpose

The backend owns:

* Portfolio content
* Business logic
* Virtual Me AI
* Knowledge management
* Retrieval
* Analytics
* Storage integration

The backend does NOT own:

* UI
* Animations
* Layout
* Experience delivery

---

# Stack

## Core

* Python 3.13+
* FastAPI
* Uvicorn

## Validation

* Pydantic V2
* pydantic-settings

## Database

* Supabase PostgreSQL
* SQLAlchemy
* Alembic

## AI

* PydanticAI
* OpenAI

## Retrieval

* pgvector
* PostgreSQL Full Text Search
* Reciprocal Rank Fusion

## HTTP

* httpx

## Logging

* structlog

## Testing

* pytest

## Package Management

* uv

Stack is locked unless explicitly changed.

Do not introduce alternatives without justification.

---

# Repository Layout

```text
backend/
│
├── alembic/
│
├── app/
│   ├── main.py
│   ├── config.py
│   │
│   ├── api/
│   │
│   ├── assistant/
│   │
│   ├── retrieval/
│   │
│   ├── ingestion/
│   │
│   ├── database/
│   │
│   ├── services/
│   │
│   ├── schemas/
│   │
│   └── models/
│
├── scripts/
│
└── tests/
```

---

# Architectural Boundaries

## API Layer

Responsible for:

* Request handling
* Response generation
* Validation

Must not contain:

* Retrieval logic
* Database logic
* Business rules

---

## Service Layer

Responsible for:

* Business logic
* Orchestration

Must not contain:

* SQL queries
* HTTP route definitions

---

## Database Layer

Responsible for:

* Persistence
* Queries
* Database models

Must not contain:

* AI logic
* Business logic

---

## Retrieval Layer

Responsible for:

* Vector search
* Full text search
* Rank fusion

Must remain isolated.

---

## Assistant Layer

Responsible for:

* Virtual Me agent
* Prompt construction
* Grounding
* Response generation

Must not directly query the database.

Use retrieval services.

---

# Virtual Me Architecture

The Virtual Me system follows:

```text
Visitor
   │
   ▼
Chat Session
   │
   ▼
Thread
   │
   ▼
Question
   │
   ▼
Hybrid Retrieval
   │
   ▼
Relevant Context
   │
   ▼
PydanticAI Agent
   │
   ▼
Grounding Validation
   │
   ▼
Response
```

---

# Grounding Rules

Grounding is mandatory.

Virtual Me should answer only from retrieved context.

If information is unavailable:

Return an uncertainty response.

Example:

"I don't have enough information about Atharva to answer that accurately."

Hallucinations are considered defects.

---

# Retrieval Rules

Portfolio 2.0 uses Hybrid Retrieval.

Components:

* pgvector similarity search
* PostgreSQL Full Text Search
* Reciprocal Rank Fusion

The retrieval system should remain independent of the agent.

The agent receives context.

The agent does not perform retrieval.

---

# Content Architecture

Portfolio content originates from PostgreSQL.

Examples:

* Profile
* Skills
* Projects
* Testimonials
* Resume metadata

Frontend components should never become the source of truth.

---

# Configuration

app.config.settings is the single source of truth.

Rules:

* No os.getenv throughout the codebase.
* No load_dotenv.
* No duplicated configuration logic.

Fail fast when required settings are missing.

---

# Database Rules

Alembic is the source of truth.

Do not manually modify production schemas.

All schema changes:

```text
Model Change
    ↓
Alembic Migration
    ↓
Review
    ↓
Apply
```

---

# Storage Rules

Supabase Storage stores:

* Images
* Resume PDFs
* Artwork
* Videos

PostgreSQL stores only metadata and URLs.

Binary files must never be stored in database tables.

---

# Async Rules

Request path code should be async.

Use:

```python
async def
```

for:

* Route handlers
* Database access
* OpenAI calls
* External HTTP calls

Avoid blocking I/O.

---

# Tests

Prefer unit tests.

Test priorities:

1. Retrieval
2. Grounding
3. Session Management
4. Knowledge Ingestion
5. API Contracts

Fast tests should require:

* No network
* No OpenAI
* No database

Integration tests should be explicitly marked.

---

# Anti-Patterns

Do not:

* Access environment variables directly.
* Hardcode portfolio content.
* Couple retrieval to the agent.
* Couple database access to route handlers.
* Add unnecessary abstractions.
* Introduce repository patterns without justification.
* Introduce service layers that contain no logic.
* Catch Exception only to log and re-raise.
* Add silent fallbacks.

---

# Final Backend Rule

The backend exists to provide:

* Content
* Context
* Intelligence

The backend should remain simple, maintainable, and extensible.

Prefer obvious code over clever code.

# Portfolio 2.0 — Backend Development Roadmap

**Version:** 1.0
**Status:** Active
**Depends On:**

* PROJECT_CONSTITUTION.md
* INFORMATION_ARCHITECTURE.md
* ARCHITECTURE.md
* AGENTS.md
* BACKEND_AGENTS.md

---

# Purpose

This document serves as the implementation roadmap for the Portfolio 2.0 backend.

It breaks the approved architecture into sequential development milestones while maintaining the project's guiding principles:

* Simplicity
* Extensibility
* Clear architectural boundaries
* Content-driven architecture
* Production-quality engineering

The goal is to complete the backend in a stable, incremental manner before beginning frontend development.

---

# Development Philosophy

Portfolio 2.0 follows a **backend-first** development strategy.

The backend owns:

* Portfolio content
* Business logic
* AI context
* Retrieval
* Storage management
* Analytics

The frontend acts primarily as a presentation layer that consumes backend APIs.

This approach provides:

* Stable APIs before UI development
* Clear ownership boundaries
* Easier frontend iteration
* Better long-term maintainability

---

# Overall Development Flow

```text
Design Freeze
        │
        ▼
Project Bootstrap
        │
        ▼
Database Foundation
        │
        ▼
Content Models
        │
        ▼
REST APIs
        │
        ▼
Media Layer
        │
        ▼
Knowledge Base
        │
        ▼
Embeddings
        │
        ▼
Hybrid Retrieval
        │
        ▼
Virtual Me
        │
        ▼
Chat System
        │
        ▼
Analytics
        │
        ▼
Production Hardening
```

---

# Phase -1 — Backend Design Freeze

## Goal

Before writing implementation code, finalize all architectural conventions to ensure consistency throughout the project.

---

## TODO

### Project Structure

* [ ] Final folder hierarchy
* [ ] Module organization
* [ ] Import conventions

### API Standards

* [ ] API response format
* [ ] Error response format
* [ ] Pagination strategy
* [ ] Versioning strategy

### Database Standards

* [ ] SQLAlchemy conventions
* [ ] Naming conventions
* [ ] Relationship strategy
* [ ] Migration workflow

### Service Layer

* [ ] Business logic conventions
* [ ] Dependency Injection strategy
* [ ] Repository usage (or avoidance)

### Configuration

* [ ] Centralized settings
* [ ] Environment validation
* [ ] Secrets management

### Logging

* [ ] Logging format
* [ ] Log levels
* [ ] Request logging

### Testing

* [ ] Test directory structure
* [ ] Unit testing conventions
* [ ] Integration testing conventions

---

## Deliverable

A finalized backend architecture ready for implementation.

---

# Phase 0 — Project Bootstrap

## Goal

Create the production-ready backend foundation.

---

## TODO

### Project Initialization

* [ ] Initialize FastAPI project
* [ ] Configure Python 3.13+
* [ ] Setup `uv`

### Code Quality

* [ ] Ruff
* [ ] Formatting
* [ ] Pytest
* [ ] Pre-commit hooks

### Project Structure

* [ ] Repository layout
* [ ] Package organization

### Configuration

* [ ] Centralized `settings.py`
* [ ] Environment validation
* [ ] Fail-fast configuration

### Infrastructure

* [ ] Structlog
* [ ] Health endpoint
* [ ] Dockerfile
* [ ] Docker Compose (if required)

---

## Deliverable

```http
GET /health

200 OK
```

---

# Phase 1 — Database Foundation

## Goal

Build the database infrastructure.

---

## TODO

### Database

* [ ] SQLAlchemy setup
* [ ] Async Engine
* [ ] Async Sessions
* [ ] Base Model

### Migrations

* [ ] Alembic
* [ ] Initial migration
* [ ] Migration workflow

### PostgreSQL

* [ ] pgvector extension
* [ ] Timestamp mixins

---

## Deliverable

A fully connected PostgreSQL database with migrations.

---

# Phase 2 — Core Content Models

## Goal

Implement all portfolio data models.

---

## Models

* [ ] Profile
* [ ] Skills
* [ ] Projects
* [ ] ProjectSkills
* [ ] Testimonials
* [ ] Resume
* [ ] ContactMessages

---

## Schemas

* [ ] Request schemas
* [ ] Response schemas
* [ ] Validation models

---

## Services

* [ ] CRUD services
* [ ] Database operations

---

## Deliverable

Complete database schema.

---

# Phase 3 — REST API Layer

## Goal

Expose portfolio content through REST APIs.

---

## APIs

* [ ] `/profile`
* [ ] `/skills`
* [ ] `/projects`
* [ ] `/testimonials`
* [ ] `/resume`
* [ ] `/contact`

---

## Additional Tasks

* [ ] Validation
* [ ] Error handling
* [ ] Pagination
* [ ] Response models

---

## Deliverable

All portfolio content available through REST APIs.

---

# Phase 4 — Media Layer

## Goal

Implement media management.

---

## TODO

### Storage

* [ ] Supabase Storage client
* [ ] Upload helpers
* [ ] Signed URLs

### Media Management

* [ ] Metadata service
* [ ] File organization
* [ ] Storage abstraction

---

## Deliverable

Backend fully manages media assets.

---

# Phase 5 — Knowledge Base

## Goal

Prepare the knowledge base powering Virtual Me.

---

## Database

* [ ] knowledge_documents
* [ ] document_chunks

---

## Services

* [ ] Document ingestion
* [ ] Chunk generation
* [ ] Metadata extraction

---

## Deliverable

Knowledge Base ready for embeddings.

---

# Phase 6 — Embedding Pipeline

## Goal

Generate and store embeddings.

---

## TODO

* [ ] OpenAI Embeddings
* [ ] Batch embedding generation
* [ ] Embedding persistence
* [ ] Re-embedding workflow

---

## Deliverable

Every document chunk contains embeddings.

---

# Phase 7 — Hybrid Retrieval

## Goal

Implement production-grade retrieval.

---

## Components

### Vector Search

* [ ] pgvector similarity search

### Keyword Search

* [ ] PostgreSQL Full Text Search

### Rank Fusion

* [ ] Reciprocal Rank Fusion (RRF)

### Retrieval Service

* [ ] Unified retrieval interface

---

## Deliverable

```text
User Question
      │
      ▼
Relevant Context
```

without involving the LLM.

---

# Phase 8 — Virtual Me

## Goal

Build the AI assistant.

---

## TODO

### Agent

* [ ] PydanticAI agent
* [ ] Prompt construction
* [ ] Context injection

### Grounding

* [ ] Grounding validation
* [ ] Hallucination prevention

### Responses

* [ ] Streaming responses

---

## Deliverable

A grounded AI capable of answering portfolio-related questions.

---

# Phase 9 — Chat System

## Goal

Persist visitor conversations.

---

## Database

* [ ] Chat Visitors
* [ ] Chat Threads
* [ ] Chat Messages

---

## APIs

* [ ] Start session
* [ ] Create thread
* [ ] Send message
* [ ] Retrieve history

---

## Deliverable

Persistent conversations for Virtual Me.

---

# Phase 10 — Analytics

## Goal

Implement lightweight analytics.

---

## TODO

### Resume

* [ ] Resume download tracking

### Contact

* [ ] Contact metrics

### Chat

* [ ] Conversation statistics
* [ ] Usage metrics

---

## Deliverable

Basic analytics for portfolio interactions.

---

# Phase 11 — Production Hardening

## Goal

Prepare the backend for deployment.

---

## Testing

* [ ] Unit Tests
* [ ] Retrieval Tests
* [ ] Grounding Tests
* [ ] API Contract Tests

---

## Infrastructure

* [ ] GitHub Actions
* [ ] Render deployment
* [ ] Secrets management
* [ ] Logging improvements
* [ ] Error handling

---

## Deliverable

Production-ready backend.

---

# Suggested Backend Structure

```text
backend/
│
├── alembic/
├── scripts/
├── tests/
│
├── app/
│   ├── main.py
│   ├── config.py
│   │
│   ├── api/
│   │   ├── routes/
│   │   └── dependencies.py
│   │
│   ├── assistant/
│   ├── retrieval/
│   ├── ingestion/
│   ├── database/
│   │   ├── session.py
│   │   ├── base.py
│   │   └── migrations.py
│   │
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── storage/
│   ├── analytics/
│   ├── utils/
│   └── core/
│
└── pyproject.toml
```

---

# Final Milestone

At the end of this roadmap, the backend will provide:

* Production-ready REST APIs
* Content management
* Media management
* Hybrid Retrieval (Vector + FTS + RRF)
* Grounded Virtual Me AI
* Persistent conversations
* Analytics
* CI/CD deployment
* Extensible architecture ready for frontend integration

Only after completing these milestones should frontend development begin, ensuring that the frontend can focus exclusively on delivering the premium experience defined in the project vision.

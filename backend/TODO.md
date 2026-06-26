# TODO.md

# Portfolio 2.0 Backend Development Roadmap

> **Status:** Active
> **Architecture:** Frozen
> **Principle:** Reach a working implementation first. Optimize only after the milestone is complete.

---

# Development Philosophy

This roadmap intentionally stays at a **high level**.

Each item represents a meaningful milestone that produces a working piece of the backend.

Implementation details will be discussed **one step at a time** during development.

The roadmap itself remains stable.

---

# Phase 0 — Project Foundation

## Goal

Create a bootable backend with the project skeleton and development infrastructure.

### TODO

* [ ] Bootstrap the backend project
* [ ] Create the approved project structure
* [ ] Configure application settings
* [ ] Configure logging
* [ ] Configure development tooling
* [ ] Implement application lifecycle
* [ ] Implement health endpoint
* [ ] Establish testing foundation

### Definition of Done

* Backend starts successfully
* `/health` endpoint works
* Tooling passes
* Project structure is complete

---

# Phase 1 — Database Foundation

## Goal

Establish the persistence layer.

### TODO

* [ ] Configure PostgreSQL
* [ ] Configure SQLAlchemy
* [ ] Configure Alembic
* [ ] Configure database sessions
* [ ] Implement base model
* [ ] Implement common mixins
* [ ] Enable pgvector

### Definition of Done

* Database connects
* Migrations execute
* Sessions work correctly

---

# Phase 2 — Portfolio Content

## Goal

Model the portfolio domain.

### TODO

* [ ] Create ORM models
* [ ] Implement relationships
* [ ] Create Pydantic schemas
* [ ] Implement business services
* [ ] Create database migrations
* [ ] Test content layer

### Definition of Done

The backend fully understands portfolio data.

---

# Phase 3 — Public API

## Goal

Expose portfolio data through REST APIs.

### TODO

* [ ] Configure API router
* [ ] Implement portfolio endpoints
* [ ] Implement validation
* [ ] Implement error handling
* [ ] Verify OpenAPI documentation
* [ ] Test API layer

### Definition of Done

All portfolio content is available through REST APIs.

---

# Phase 4 — Media Management

## Goal

Manage binary assets.

### TODO

* [ ] Configure Supabase Storage
* [ ] Implement storage client
* [ ] Implement upload service
* [ ] Implement URL generation
* [ ] Validate uploads
* [ ] Test storage layer

### Definition of Done

Media is centrally managed by the backend.

---

# Phase 5 — Knowledge Base

## Goal

Transform portfolio content into structured knowledge.

### TODO

* [ ] Create knowledge models
* [ ] Build ingestion pipeline
* [ ] Implement parser
* [ ] Implement chunking
* [ ] Extract metadata
* [ ] Persist knowledge
* [ ] Test ingestion pipeline

### Definition of Done

Knowledge is stored in structured chunks.

---

# Phase 6 — Embedding Pipeline

## Goal

Generate semantic embeddings.

### TODO

* [ ] Configure OpenAI embeddings
* [ ] Implement embedding pipeline
* [ ] Store embeddings
* [ ] Support re-embedding
* [ ] Test embedding workflow

### Definition of Done

Every knowledge chunk has an embedding.

---

# Phase 7 — Hybrid Retrieval

## Goal

Retrieve relevant knowledge.

### TODO

* [ ] Implement vector search
* [ ] Implement keyword search
* [ ] Implement Reciprocal Rank Fusion
* [ ] Build retrieval pipeline
* [ ] Test retrieval quality

### Definition of Done

Relevant context can be retrieved reliably.

---

# Phase 8 — Virtual Me

## Goal

Implement the AI assistant.

### TODO

* [ ] Configure PydanticAI
* [ ] Build prompt system
* [ ] Build context manager
* [ ] Implement grounding
* [ ] Implement streaming responses
* [ ] Expose chat endpoint
* [ ] Test assistant

### Definition of Done

Virtual Me answers grounded questions about Atharva.

---

# Phase 9 — Chat System

## Goal

Persist visitor conversations.

### TODO

* [ ] Create chat models
* [ ] Implement conversation services
* [ ] Implement chat APIs
* [ ] Persist conversation history
* [ ] Test chat system

### Definition of Done

Visitors have persistent conversations.

---

# Phase 10 — Analytics

## Goal

Capture meaningful usage metrics.

### TODO

* [ ] Track resume downloads
* [ ] Track contact submissions
* [ ] Track chat metrics
* [ ] Generate analytics reports
* [ ] Test analytics

### Definition of Done

Meaningful backend metrics are available.

---

# Phase 11 — Production Readiness

## Goal

Prepare for public deployment.

### TODO

* [ ] Security review
* [ ] Performance review
* [ ] Complete testing
* [ ] Configure CI/CD
* [ ] Configure Docker
* [ ] Deployment verification
* [ ] Documentation review

### Definition of Done

The backend is production-ready.

---

# Working Agreement

During implementation:

* Work on **one TODO item at a time**.
* Do not skip ahead.
* Every implementation discussion follows:

  * **What to do**
  * **How to do it**
  * **Why to do it**
* Reach a working implementation before discussing optimizations.
* Architecture changes require discussion before implementation.
* No speculative improvements or premature abstractions.

---

# Project Status

```
Phase 0  ☐
Phase 1  ☐
Phase 2  ☐
Phase 3  ☐
Phase 4  ☐
Phase 5  ☐
Phase 6  ☐
Phase 7  ☐
Phase 8  ☐
Phase 9  ☐
Phase 10 ☐
Phase 11 ☐
```

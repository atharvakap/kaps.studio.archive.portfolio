# IMPLEMENTATION_PLAYBOOK.md

---

# Phase -1 — Architecture Freeze

## Objective

Freeze all architectural decisions before implementation begins.

This phase exists to eliminate architectural uncertainty during development.

The outcome of this phase is **confidence**, not code.

---

## Dependencies

None.

This phase starts immediately.

---

## Deliverables

* Approved architecture
* Approved project structure
* Approved module boundaries
* Approved backend conventions
* Frozen implementation strategy

---

## Frozen Project Structure

> This directory structure is considered frozen once approved.

```text
backend/
│
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── scripts/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── conftest.py
│
├── app/
│   │
│   ├── main.py
│   ├── lifespan.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   ├── responses.py
│   │   ├── security.py
│   │   └── constants.py
│   │
│   ├── api/
│   │   ├── router.py
│   │   ├── dependencies.py
│   │   └── routes/
│   │
│   ├── database/
│   │   ├── base.py
│   │   ├── session.py
│   │   ├── mixins.py
│   │   └── types.py
│   │
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── assistant/
│   ├── retrieval/
│   ├── ingestion/
│   ├── storage/
│   ├── analytics/
│   └── utils/
│
├── pyproject.toml
├── uv.lock
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Architecture Review Checklist

### Folder Responsibilities

* [ ] core owns application infrastructure.
* [ ] api owns HTTP layer only.
* [ ] services own business logic.
* [ ] database owns persistence.
* [ ] models own ORM entities.
* [ ] schemas own API validation.
* [ ] assistant owns Virtual Me.
* [ ] retrieval owns Hybrid Retrieval.
* [ ] ingestion owns Knowledge Base ingestion.
* [ ] storage owns Supabase Storage.
* [ ] analytics owns metrics.
* [ ] utils contains stateless helper utilities only.

---

### Project Standards

* [ ] Stack confirmed
* [ ] Naming conventions confirmed
* [ ] API conventions confirmed
* [ ] Database conventions confirmed
* [ ] Logging strategy confirmed
* [ ] Testing strategy confirmed
* [ ] Configuration strategy confirmed

---

## Verification

* [ ] No unresolved architecture decisions.
* [ ] Project structure approved.
* [ ] Ready to begin implementation.

---

## Definition of Done

Development can begin without revisiting architecture.

---

# Phase 0 — Project Bootstrap

## Objective

Create a production-ready backend foundation.

No business logic should exist after this phase.

Only infrastructure.

---

## Dependencies

* Phase -1 completed

---

## Repository Initialization

### Environment

* [ ] Install Python 3.13+
* [ ] Install uv
* [ ] Initialize project
* [ ] Initialize Git
* [ ] Create virtual environment

---

### Project Files

Create:

```text
pyproject.toml
.env.example
.gitignore
Dockerfile
docker-compose.yml
README.md
```

---

### Create Directory Structure

Create every directory defined in Phase -1.

No additional folders.

---

### Core Files

Create:

```text
app/main.py
app/lifespan.py
```

---

### Core Module

Create:

```text
core/
```

Files:

* [ ] config.py
* [ ] logging.py
* [ ] exceptions.py
* [ ] responses.py
* [ ] security.py
* [ ] constants.py

---

### Database Module

Create:

```text
database/
```

Files:

* [ ] base.py
* [ ] session.py
* [ ] mixins.py
* [ ] types.py

---

### API Module

Create:

```text
api/
```

Files:

* [ ] router.py
* [ ] dependencies.py

Create:

```text
routes/
```

No endpoints yet.

---

### Remaining Modules

Create empty packages:

* [ ] models
* [ ] schemas
* [ ] services
* [ ] assistant
* [ ] retrieval
* [ ] ingestion
* [ ] storage
* [ ] analytics
* [ ] utils

---

## Tooling

Configure:

* [ ] Ruff
* [ ] Pytest
* [ ] Alembic
* [ ] Structlog
* [ ] Pre-commit

---

## Configuration

Implement:

* [ ] Centralized settings
* [ ] Environment validation
* [ ] Fail-fast configuration

---

## Logging

Implement:

* [ ] Structlog
* [ ] Request logging
* [ ] Startup logging
* [ ] Shutdown logging

---

## Health Endpoint

Implement:

```http
GET /health
```

Returns:

```json
{
    "status": "ok"
}
```

---

## Tests

Create:

* [ ] health endpoint test
* [ ] configuration validation test

---

## Verification

* [ ] Backend starts
* [ ] Health endpoint works
* [ ] Ruff passes
* [ ] Pytest passes
* [ ] Docker builds successfully

---

## Definition of Done

A new developer can clone the repository and run the backend successfully.

---

# Phase 1 — Database Foundation

## Objective

Build a production-ready persistence layer.

No application models yet.

Only infrastructure.

---

## Dependencies

Phase 0 completed.

---

## PostgreSQL

Configure:

* [ ] Async PostgreSQL connection
* [ ] Connection pooling
* [ ] Connection lifecycle

---

## SQLAlchemy

Implement:

* [ ] Async engine
* [ ] Async session
* [ ] Declarative base

---

## Base Model

Create reusable base model.

Implement:

* [ ] UUID primary key
* [ ] created_at
* [ ] updated_at

---

## Mixins

Implement:

* [ ] TimestampMixin
* [ ] UUIDMixin

---

## Database Types

Implement:

* [ ] UUID aliases
* [ ] JSON helpers
* [ ] Common database types

---

## Alembic

Configure:

* [ ] env.py
* [ ] async migrations
* [ ] migration autogeneration
* [ ] naming conventions

---

## PostgreSQL Extensions

Enable:

* [ ] pgvector

Verify:

```sql
SELECT extname
FROM pg_extension;
```

---

## Session Dependency

Implement reusable dependency:

```python
get_db()
```

---

## Tests

Create tests for:

* [ ] Database connection
* [ ] Session creation
* [ ] Migration execution
* [ ] Base model
* [ ] UUID generation

---

## Verification Checklist

* [ ] Database connects successfully.
* [ ] Migrations execute.
* [ ] Sessions open correctly.
* [ ] Sessions close correctly.
* [ ] pgvector enabled.
* [ ] Tests pass.

---

## Definition of Done

The backend has a stable, reusable, production-ready persistence layer that future phases can build upon without modification.

---

# Phase 2 — Content Domain

## Objective

Implement every database entity that represents the portfolio itself.

At the end of this phase, the backend should understand the complete portfolio data model, but no public APIs should exist yet.

---

## Dependencies

* Phase 1 completed
* Database foundation stable
* Alembic configured

---

# Implementation Order

The implementation order below is frozen.

```
1. Mixins
2. Models
3. Relationships
4. Schemas
5. Services
6. Unit Tests
7. Database Migration
```

---

# Models

Implement models in the following order.

## Profile

Create:

```
app/models/profile.py
```

Tasks

* [ ] Create `Profile`
* [ ] Configure table name
* [ ] UUID primary key
* [ ] Identity fields
* [ ] Metadata fields
* [ ] Timestamps
* [ ] Constraints
* [ ] Indexes

---

## Skill

Create

```
app/models/skill.py
```

Tasks

* [ ] Skill entity
* [ ] Category enum
* [ ] Display order
* [ ] Icon URL
* [ ] Indexes

---

## Project

Create

```
app/models/project.py
```

Tasks

* [ ] Project entity
* [ ] Slug
* [ ] Featured flag
* [ ] GitHub URL
* [ ] Live URL
* [ ] Hero image
* [ ] Constraints

---

## ProjectSkill

Create

```
app/models/project_skill.py
```

Tasks

* [ ] Many-to-many table
* [ ] Composite PK
* [ ] Foreign keys
* [ ] Cascade strategy

---

## Testimonial

Create

```
app/models/testimonial.py
```

Tasks

* [ ] Author
* [ ] Company
* [ ] Designation
* [ ] Rating
* [ ] Featured flag

---

## Resume

Create

```
app/models/resume.py
```

Tasks

* [ ] File URL
* [ ] Version
* [ ] Active flag
* [ ] Upload timestamp

---

## Contact Message

Create

```
app/models/contact_message.py
```

Tasks

* [ ] Visitor name
* [ ] Email
* [ ] Message
* [ ] Read flag
* [ ] Created timestamp

---

# Relationships

Implement only after all models exist.

Tasks

* [ ] Profile relationships
* [ ] Project ↔ Skills
* [ ] Cascade rules
* [ ] Lazy loading
* [ ] Back references

---

# Schemas

Create

```
app/schemas/
```

Each model should have:

### Read Schema

* [ ] Response model

### Create Schema

* [ ] Input validation

### Update Schema

* [ ] Partial updates

### Shared Schema

* [ ] Base schema

Implement:

* [ ] profile.py
* [ ] skill.py
* [ ] project.py
* [ ] testimonial.py
* [ ] resume.py
* [ ] contact.py

---

# Services

Create

```
app/services/
```

Implement

## ProfileService

* [ ] get_profile()
* [ ] update_profile()

---

## SkillService

* [ ] list_skills()

---

## ProjectService

* [ ] list_projects()
* [ ] get_project()
* [ ] featured_projects()

---

## TestimonialService

* [ ] list_testimonials()

---

## ResumeService

* [ ] active_resume()

---

## ContactService

* [ ] create_message()

---

# Migration

Generate

```
Initial Content Migration
```

Verify

* [ ] Tables created
* [ ] Constraints applied
* [ ] Foreign keys correct
* [ ] Indexes created

---

# Tests

```
tests/unit/models/
```

Implement

* [ ] Profile tests
* [ ] Skill tests
* [ ] Project tests
* [ ] Relationship tests
* [ ] Schema validation tests
* [ ] Service tests

---

# Verification

* [ ] Models compile
* [ ] Migration succeeds
* [ ] Relationships function
* [ ] CRUD services work
* [ ] Tests pass

---

# Definition of Done

Every content entity exists with validated schemas, business services, relationships, and tests.

---

# Phase 3 — Public REST APIs

## Objective

Expose every portfolio resource through stable REST endpoints.

Frontend development should never require direct database access.

---

## Dependencies

* Phase 2 completed

---

# API Version

```
/api/v1
```

---

# Router

Create

```
app/api/router.py
```

Register all routes.

---

# Route Files

Create

```
routes/
```

Files

* [ ] profile.py
* [ ] skills.py
* [ ] projects.py
* [ ] testimonials.py
* [ ] resume.py
* [ ] contact.py

---

# Profile API

Implement

```
GET /profile
PUT /profile
```

Tasks

* [ ] Validation
* [ ] Response model
* [ ] Error handling

---

# Skills API

Implement

```
GET /skills
```

Tasks

* [ ] Sorting
* [ ] Filtering
* [ ] Categories

---

# Projects API

Implement

```
GET /projects

GET /projects/{slug}
```

Tasks

* [ ] Slug lookup
* [ ] Featured projects
* [ ] Skill expansion

---

# Testimonials API

Implement

```
GET /testimonials
```

---

# Resume API

Implement

```
GET /resume
```

Return

* metadata
* active version

(No file download yet.)

---

# Contact API

Implement

```
POST /contact
```

Tasks

* [ ] Validation
* [ ] Spam prevention hook
* [ ] Persistence

---

# Error Handling

Implement

* [ ] Validation handler
* [ ] HTTP exceptions
* [ ] Database exceptions
* [ ] Unknown exceptions

---

# API Documentation

Verify

* [ ] OpenAPI generated
* [ ] Swagger works
* [ ] Schemas visible

---

# Tests

```
tests/integration/api/
```

Implement

* [ ] Profile API
* [ ] Skills API
* [ ] Projects API
* [ ] Testimonials API
* [ ] Resume API
* [ ] Contact API

---

# Verification

* [ ] APIs return expected schema
* [ ] Validation works
* [ ] Error responses consistent
* [ ] Swagger complete

---

# Definition of Done

Every portfolio resource is available through documented REST APIs.

---

# Phase 4 — Media System

## Objective

Implement centralized media management using Supabase Storage.

Binary assets must never be stored in PostgreSQL.

---

## Dependencies

* Phase 3 completed

---

# Storage Layer

Create

```
app/storage/
```

Files

* [ ] client.py
* [ ] service.py
* [ ] upload.py
* [ ] urls.py

---

# Storage Client

Implement

* [ ] Supabase client
* [ ] Bucket configuration
* [ ] Authentication
* [ ] Error handling

---

# Buckets

Freeze bucket structure

```
profile/

projects/

artwork/

resume/

videos/
```

---

# Upload Helpers

Implement

* [ ] upload_image()
* [ ] upload_resume()
* [ ] upload_video()

---

# URL Helpers

Implement

* [ ] public_url()
* [ ] signed_url()

---

# Media Metadata

Store

* File name
* Bucket
* URL
* MIME type
* Size
* Upload timestamp

---

# Validation

Implement

* [ ] MIME validation
* [ ] Size validation
* [ ] Extension validation

---

# Error Handling

Implement

* [ ] Upload failure
* [ ] Missing file
* [ ] Invalid bucket
* [ ] Permission errors

---

# Tests

```
tests/unit/storage/
```

Implement

* [ ] Upload tests
* [ ] Signed URL tests
* [ ] Validation tests
* [ ] Failure handling

---

# Verification

* [ ] Upload succeeds
* [ ] Public URLs generated
* [ ] Signed URLs generated
* [ ] Metadata persisted
* [ ] Validation enforced

---

# Definition of Done

The backend fully owns media management, and all binary assets are stored in Supabase Storage with validated metadata.

---

# Phase 5 — Knowledge Base

## Objective

Build the knowledge management system that powers Virtual Me.

This phase is responsible for converting raw portfolio content into structured, retrievable knowledge.

**No LLMs are involved in this phase.**

---

## Dependencies

* Phase 4 completed
* Media system operational
* Database stable

---

# Knowledge Architecture

Knowledge flows through the following pipeline:

```text
Source Content
      │
      ▼
Knowledge Document
      │
      ▼
Metadata Extraction
      │
      ▼
Chunk Generation
      │
      ▼
Chunk Storage
      │
      ▼
Embedding Pipeline
```

---

# Database Models

## KnowledgeDocument

Create

```text
app/models/knowledge_document.py
```

Tasks

* [ ] UUID primary key
* [ ] Title
* [ ] Source type
* [ ] Original content
* [ ] Metadata (JSON)
* [ ] Created timestamp
* [ ] Updated timestamp

---

## DocumentChunk

Create

```text
app/models/document_chunk.py
```

Tasks

* [ ] UUID primary key
* [ ] Document FK
* [ ] Chunk index
* [ ] Chunk content
* [ ] Embedding column (pgvector)
* [ ] Metadata
* [ ] Timestamps

---

# Source Types

Freeze source types.

```text
resume
project
experience
skills
philosophy
faq
photography
blender
personal
```

No hardcoded prompts should replace these sources.

---

# Schemas

Create

```text
schemas/
```

Implement

* [ ] KnowledgeDocumentCreate
* [ ] KnowledgeDocumentResponse
* [ ] ChunkResponse

---

# Ingestion Module

Create

```text
app/ingestion/
```

Files

* [ ] loader.py
* [ ] parser.py
* [ ] chunker.py
* [ ] metadata.py
* [ ] pipeline.py

---

# Loader

Responsibilities

* [ ] Read markdown
* [ ] Read plain text
* [ ] Read JSON
* [ ] Read PDF (future)

---

# Parser

Responsibilities

* [ ] Normalize text
* [ ] Remove unnecessary whitespace
* [ ] Preserve formatting where useful
* [ ] Strip unsupported content

---

# Chunker

Implement semantic chunking.

Tasks

* [ ] Configurable chunk size
* [ ] Configurable overlap
* [ ] Preserve paragraph boundaries
* [ ] Maintain chunk ordering

---

# Metadata Extraction

Extract

* Source
* Title
* Category
* Tags
* Chunk number
* Total chunks

---

# Ingestion Pipeline

Pipeline

```text
Load
 ↓
Parse
 ↓
Extract Metadata
 ↓
Chunk
 ↓
Persist
```

---

# Services

Create

```text
KnowledgeService
```

Functions

* [ ] ingest_document()
* [ ] delete_document()
* [ ] rebuild_document()

---

# Tests

Implement

* [ ] Loader tests
* [ ] Parser tests
* [ ] Chunking tests
* [ ] Metadata tests
* [ ] Service tests

---

# Verification

* [ ] Documents ingest successfully
* [ ] Metadata generated
* [ ] Chunks generated
* [ ] Chunks persisted
* [ ] Tests pass

---

# Definition of Done

The backend can ingest portfolio knowledge into structured chunks ready for embedding.

---

# Phase 6 — Embedding Pipeline

## Objective

Generate semantic embeddings for every knowledge chunk and persist them into PostgreSQL.

No retrieval occurs during this phase.

---

## Dependencies

* Phase 5 completed

---

# Embedding Architecture

```text
Document Chunk
      │
      ▼
Embedding Queue
      │
      ▼
OpenAI Embedding Model
      │
      ▼
Vector
      │
      ▼
Database
```

---

# Embedding Module

Create

```text
app/ingestion/embedding.py
```

---

# OpenAI Client

Implement

* [ ] Client initialization
* [ ] Authentication
* [ ] Retry strategy
* [ ] Timeout handling

---

# Embedding Generation

Functions

* [ ] embed_chunk()
* [ ] embed_document()
* [ ] embed_all()

---

# Batch Processing

Implement

* [ ] Batch size configuration
* [ ] Rate limiting
* [ ] Retry failed batches
* [ ] Resume interrupted jobs

---

# Persistence

Store

* Vector
* Embedding model
* Embedding timestamp

---

# Re-Embedding Workflow

Implement

* [ ] Detect stale embeddings
* [ ] Force rebuild
* [ ] Full rebuild

---

# Services

Implement

```text
EmbeddingService
```

Functions

* [ ] generate()
* [ ] regenerate()
* [ ] queue_document()

---

# Error Handling

Handle

* OpenAI failures
* Timeout
* Empty documents
* Invalid vectors

---

# Tests

Implement

* [ ] Embedding generation
* [ ] Batch processing
* [ ] Retry logic
* [ ] Persistence
* [ ] Rebuild workflow

Mock all external API calls.

---

# Verification

* [ ] Every chunk has embeddings
* [ ] Batch processing works
* [ ] Failed batches recover
* [ ] Tests pass

---

# Definition of Done

Every knowledge chunk has a valid embedding stored in pgvector.

---

# Phase 7 — Hybrid Retrieval

## Objective

Implement the complete retrieval engine for Virtual Me.

This phase **does not invoke the LLM**.

The goal is to retrieve the best possible context.

---

## Dependencies

* Phase 6 completed

---

# Retrieval Architecture

```text
Question
      │
      ▼
Embedding
      │
      ├────────────┐
      ▼            ▼
Vector Search   Full Text Search
      │            │
      └──────┬─────┘
             ▼
      Reciprocal Rank Fusion
             ▼
      Ranked Context
```

---

# Retrieval Module

Create

```text
app/retrieval/
```

Files

* [ ] vector.py
* [ ] keyword.py
* [ ] rrf.py
* [ ] pipeline.py
* [ ] ranking.py

---

# Vector Search

Implement

Functions

* [ ] embed_query()
* [ ] similarity_search()

Configuration

* Top K
* Similarity threshold

---

# PostgreSQL Full Text Search

Implement

Functions

* [ ] keyword_search()

Tasks

* [ ] TSVECTOR index
* [ ] Ranking
* [ ] Language configuration

---

# Reciprocal Rank Fusion

Create

```text
rrf.py
```

Implement

* [ ] RRF algorithm
* [ ] Configurable constant
* [ ] Stable ranking
* [ ] Duplicate removal

---

# Retrieval Pipeline

Pipeline

```text
User Question
        │
        ▼
Query Embedding
        │
        ├─────────────┐
        ▼             ▼
Vector Search     Keyword Search
        │             │
        └──────┬──────┘
               ▼
      Reciprocal Rank Fusion
               ▼
        Ranked Context
```

---

# Retrieval Service

Implement

```text
RetrievalService
```

Functions

* [ ] retrieve()
* [ ] retrieve_chunks()
* [ ] rank_results()

---

# Configuration

Expose

* Top K
* Similarity threshold
* Keyword limit
* RRF constant
* Maximum context length

---

# Error Handling

Handle

* Missing embeddings
* Empty results
* Invalid queries
* Search failures

---

# Performance

Measure

* Vector latency
* Keyword latency
* Fusion latency
* Total retrieval latency

Target

* Retrieval under 200 ms (excluding LLM generation)

---

# Tests

Implement

* [ ] Vector search
* [ ] Keyword search
* [ ] RRF
* [ ] Ranking quality
* [ ] Performance tests
* [ ] Retrieval pipeline

---

# Verification

* [ ] Vector search returns relevant chunks
* [ ] FTS returns relevant chunks
* [ ] RRF combines results correctly
* [ ] Ranked context is deterministic
* [ ] Performance target met

---

# Definition of Done

The backend can reliably retrieve grounded context from the portfolio knowledge base without involving the language model.

---

# Phase 8 — Virtual Me

## Objective

Build the AI assistant that represents Atharva.

Virtual Me is **not** a general-purpose chatbot.

It is a grounded AI system that answers questions exclusively about Atharva using retrieved portfolio knowledge.

---

## Dependencies

* Phase 7 completed
* Hybrid Retrieval operational

---

# Architecture

```text
Visitor Question
        │
        ▼
Retrieval Service
        │
        ▼
Relevant Context
        │
        ▼
Prompt Builder
        │
        ▼
PydanticAI Agent
        │
        ▼
Grounding Validation
        │
        ▼
Streaming Response
```

---

# Assistant Module

Create

```text
app/assistant/
```

Files

* [ ] agent.py
* [ ] prompts.py
* [ ] context.py
* [ ] validator.py
* [ ] streaming.py
* [ ] service.py

---

# Prompt System

Implement

* [ ] System prompt
* [ ] Context injection
* [ ] Conversation instructions
* [ ] Refusal instructions
* [ ] Grounding instructions

Prompt requirements

* Never invent information.
* Never answer outside retrieved context.
* Preserve natural conversation.
* Maintain consistent personality.
* Explain uncertainty when context is insufficient.

---

# Context Builder

Implement

Functions

* [ ] build_context()
* [ ] trim_context()
* [ ] merge_chunks()

Configuration

* Maximum chunks
* Maximum prompt length
* Token estimation

---

# PydanticAI Agent

Implement

* [ ] Agent initialization
* [ ] OpenAI model configuration
* [ ] Structured dependencies
* [ ] Streaming support

---

# Grounding Validation

Implement

Validation before response generation

* [ ] Retrieved context exists
* [ ] Context quality threshold
* [ ] Empty context detection

Validation after generation

* [ ] Response consistency
* [ ] Hallucination prevention
* [ ] Fallback response

Fallback

```text
I don't have enough information about Atharva to answer that accurately.
```

---

# Streaming

Implement

* [ ] Streaming responses
* [ ] Partial token delivery
* [ ] Cancellation support
* [ ] Error recovery

---

# Assistant Service

Create

```text
AssistantService
```

Functions

* [ ] ask()
* [ ] stream()
* [ ] validate_context()
* [ ] generate_response()

---

# API Endpoints

Create

```http
POST /api/v1/chat/message
```

Later phases will add session persistence.

---

# Tests

Implement

* [ ] Prompt tests
* [ ] Context builder tests
* [ ] Grounding tests
* [ ] Streaming tests
* [ ] Assistant service tests

Mock OpenAI.

---

# Verification

* [ ] Uses RetrievalService
* [ ] No direct DB access
* [ ] Grounding enforced
* [ ] Streaming works
* [ ] Fallback responses correct

---

# Definition of Done

Virtual Me can answer grounded questions using retrieved portfolio knowledge while preventing hallucinations.

---

# Phase 9 — Chat System

## Objective

Persist visitor conversations and provide conversation history.

---

## Dependencies

* Phase 8 completed

---

# Database Models

Create

## ChatVisitor

```text
app/models/chat_visitor.py
```

Tasks

* [ ] UUID
* [ ] Name
* [ ] Email
* [ ] Created timestamp
* [ ] Last active timestamp

---

## ChatThread

```text
app/models/chat_thread.py
```

Tasks

* [ ] UUID
* [ ] Visitor FK
* [ ] Title
* [ ] Created
* [ ] Updated
* [ ] Expiration

---

## ChatMessage

```text
app/models/chat_message.py
```

Tasks

* [ ] UUID
* [ ] Thread FK
* [ ] Role
* [ ] Message
* [ ] Timestamp

---

# Relationships

Implement

Visitor

↓

Threads

↓

Messages

---

# Schemas

Create

* [ ] VisitorCreate
* [ ] ThreadCreate
* [ ] MessageCreate
* [ ] MessageResponse
* [ ] ThreadResponse

---

# Services

Implement

## VisitorService

* [ ] create_visitor()
* [ ] get_visitor()

---

## ThreadService

* [ ] create_thread()
* [ ] rename_thread()
* [ ] list_threads()

---

## MessageService

* [ ] create_message()
* [ ] history()
* [ ] append_assistant_message()

---

# APIs

Implement

```http
POST /api/v1/chat/start

POST /api/v1/chat/thread

POST /api/v1/chat/message

GET /api/v1/chat/history/{thread_id}

GET /api/v1/chat/threads/{visitor_id}
```

---

# Conversation Flow

```text
Visitor
    │
    ▼
Create Visitor
    │
    ▼
Create Thread
    │
    ▼
Store User Message
    │
    ▼
Retrieve Context
    │
    ▼
Generate Response
    │
    ▼
Store Assistant Message
    │
    ▼
Return Stream
```

---

# Tests

Implement

* [ ] Visitor tests
* [ ] Thread tests
* [ ] Message tests
* [ ] History tests
* [ ] Integration tests

---

# Verification

* [ ] Visitor persists
* [ ] Threads persist
* [ ] Messages persist
* [ ] History retrieval works
* [ ] Assistant integrates correctly

---

# Definition of Done

Visitors can maintain multiple persistent conversations with Virtual Me.

---

# Phase 10 — Analytics

## Objective

Capture meaningful portfolio interaction metrics without compromising privacy.

---

## Dependencies

* Phase 9 completed

---

# Analytics Module

Create

```text
app/analytics/
```

Files

* [ ] service.py
* [ ] tracker.py
* [ ] reports.py

---

# Resume Analytics

Track

* [ ] Download count
* [ ] Download timestamp

---

# Contact Analytics

Track

* [ ] Message count
* [ ] Response status

---

# Chat Analytics

Track

* [ ] Conversations started
* [ ] Messages
* [ ] Average conversation length
* [ ] Retrieval latency
* [ ] AI response latency

---

# Reporting

Implement

* [ ] Daily summary
* [ ] Total counts
* [ ] Aggregated metrics

---

# Tests

Implement

* [ ] Resume tracking
* [ ] Contact tracking
* [ ] Chat metrics

---

# Verification

* [ ] Metrics recorded
* [ ] Reports generated
* [ ] Performance acceptable

---

# Definition of Done

Meaningful interaction metrics are available for portfolio monitoring.

---

# Phase 11 — Production Hardening

## Objective

Prepare the backend for public production deployment.

---

## Dependencies

All previous phases completed.

---

# Testing

Complete

## Unit

* [ ] Models
* [ ] Services
* [ ] Retrieval
* [ ] Assistant

---

## Integration

* [ ] APIs
* [ ] Database
* [ ] Storage
* [ ] Chat

---

## Retrieval Quality

* [ ] Search accuracy
* [ ] Ranking validation
* [ ] Grounding validation

---

## Performance

Measure

* Startup
* API latency
* Retrieval latency
* AI latency
* Database latency

---

# Security

Verify

* [ ] Environment variables
* [ ] Secret management
* [ ] Input validation
* [ ] Error sanitization
* [ ] CORS
* [ ] Trusted hosts

---

# CI/CD

Implement

GitHub Actions

Pipeline

```text
Lint
   │
Tests
   │
Build
   │
Deploy
```

---

# Deployment

Render

* [ ] Environment variables
* [ ] Health checks
* [ ] Startup verification

Supabase

* [ ] Database
* [ ] Storage
* [ ] Extensions

---

# Documentation

Verify

* [ ] README
* [ ] Environment setup
* [ ] Deployment guide

---

# Final Tests

* [ ] Clean installation
* [ ] Fresh database
* [ ] Full deployment
* [ ] End-to-end chat
* [ ] Retrieval validation

---

# Verification

* [ ] CI passes
* [ ] Docker builds
* [ ] Render deploys
* [ ] APIs operational
* [ ] Virtual Me operational

---

# Definition of Done

The backend is production-ready and deployable through automated CI/CD.

---

# Backend Completion Checklist

## Infrastructure

* [ ] Backend boots successfully
* [ ] Configuration centralized
* [ ] Logging operational
* [ ] Docker operational

---

## Database

* [ ] Migrations complete
* [ ] pgvector enabled
* [ ] Models complete

---

## Content

* [ ] Portfolio models
* [ ] Services
* [ ] Validation

---

## APIs

* [ ] Public REST APIs
* [ ] Swagger documentation
* [ ] Error handling

---

## Storage

* [ ] Supabase Storage
* [ ] Uploads
* [ ] Signed URLs

---

## Knowledge

* [ ] Ingestion
* [ ] Chunking
* [ ] Metadata

---

## AI

* [ ] Embeddings
* [ ] Hybrid Retrieval
* [ ] Grounding
* [ ] Virtual Me

---

## Chat

* [ ] Visitor sessions
* [ ] Threads
* [ ] Messages
* [ ] Streaming

---

## Analytics

* [ ] Resume metrics
* [ ] Contact metrics
* [ ] Chat metrics

---

## Deployment

* [ ] Tests passing
* [ ] CI/CD operational
* [ ] Render deployment
* [ ] Production verification

---

# Backend Complete

At the completion of this playbook, the backend provides:

* Production-grade FastAPI architecture
* Fully normalized PostgreSQL database
* Supabase Storage integration
* REST APIs for all portfolio content
* Knowledge ingestion pipeline
* OpenAI embedding pipeline
* Hybrid Retrieval (pgvector + PostgreSQL FTS + RRF)
* Grounded PydanticAI-powered Virtual Me
* Persistent chat system
* Portfolio analytics
* Automated CI/CD deployment

The backend is now considered feature-complete and ready for frontend integration.

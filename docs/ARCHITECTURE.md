# Portfolio 2.0 — Architecture

Version: 1.0

Status: Approved

Depends On:

* PROJECT_CONSTITUTION.md
* INFORMATION_ARCHITECTURE.md

---

# Purpose

This document defines the technical architecture of Portfolio 2.0.

The architecture must support:

* Identity-first portfolio experience
* AI-powered Virtual Me
* Content-driven architecture
* Extensibility
* Maintainability
* CI/CD driven deployment
* High performance
* Long-term evolution

This document intentionally prioritizes simplicity over enterprise-style complexity.

---

# Architectural Principles

The architecture follows the principles defined in the project constitution.

## Principle 1 — Clear Separation of Concerns

Frontend and backend responsibilities must remain clearly separated.

### Frontend Owns

* User interface
* Layout
* Components
* Animations
* Presentation logic
* Experience delivery
* Client-side interactions

### Backend Owns

* Content
* Data
* AI context
* Business logic
* Retrieval logic
* Storage management
* Analytics

---

## Principle 2 — Content Driven Architecture

Portfolio content should originate from backend-managed sources rather than frontend hardcoded data.

The frontend should act as a presentation layer.

---

## Principle 3 — Extensibility

Future additions should require minimal architectural changes.

New capabilities should be additive rather than disruptive.

---

## Principle 4 — Simplicity

Avoid unnecessary abstraction.

Avoid premature optimization.

Avoid enterprise patterns that do not provide clear value.

---

# High-Level Architecture

```text
Visitor
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ├──────────────► Supabase PostgreSQL
   │
   ├──────────────► pgvector
   │
   ├──────────────► Supabase Storage
   │
   └──────────────► OpenAI
```

---

# Technology Stack

## Frontend

### Core

* React
* TypeScript
* Vite

### Styling

* Tailwind CSS

### UI Components

* shadcn/ui

### Animation

* Motion

### 3D

* Three.js
* React Three Fiber
* Drei

### Data Fetching

* TanStack Query

---

## Backend

### Core

* FastAPI
* Python

### Validation

* Pydantic V2

### AI Layer

* PydanticAI

---

## Database

### Relational Database

* PostgreSQL (Supabase)

### Vector Search

* pgvector

### Full Text Search

* PostgreSQL Full Text Search

---

## Storage

* Supabase Storage

---

## LLM

### Generation

* OpenAI GPT Models

### Embeddings

* OpenAI Embedding Models

---

# Environment Architecture

Three environments are maintained.

## Local

Developer machine.

Purpose:

* Development
* Testing
* Debugging

---

## Preview

Automatically created from branches.

Purpose:

* Validation
* Feature review

---

## Production

Public portfolio.

Purpose:

* Live traffic

---

# Source Control Strategy

Repository Structure:

```text
main
development
```

---

## main

Production-ready branch.

Every commit must be deployable.

---

## development

Primary development branch.

All active development occurs here.

---

# Deployment Architecture

## Frontend

Platform:

* Vercel

Flow:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Build
   │
   ▼
Deploy To Vercel
```

---

## Backend

Platform:

* Render

Flow:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Tests
   │
   ▼
Deploy To Render
```

---

## Database

Platform:

* Supabase

Responsibilities:

* Relational data
* Vector data
* Storage metadata

---

# Database Architecture

The database consists of three logical domains:

## Content Layer

## AI Layer

## Analytics Layer

---

# Content Layer

Contains all portfolio content.

---

## profiles

Stores identity information.

```text
id
name
title
subtitle
about
profile_image_url
email
location
created_at
updated_at
```

---

## skills

Stores capabilities.

```text
id
name
icon_url
category
display_order
created_at
updated_at
```

---

## projects

Stores portfolio projects.

```text
id
name
slug
description
image_url
github_url
live_url
featured
created_at
updated_at
```

---

## project_skills

Many-to-many relationship.

```text
project_id
skill_id
```

---

## testimonials

Stores social proof.

```text
id
name
designation
company
image_url
testimonial
rating
featured
created_at
```

---

## contact_messages

Stores visitor messages.

```text
id
name
email
message
created_at
is_read
```

---

## resumes

Stores active resume metadata.

```text
id
file_url
version
active
uploaded_at
```

---

# Analytics Layer

---

## resume_downloads

Tracks resume downloads.

```text
id
resume_id
name
email
downloaded_at
```

---

# AI Layer

The AI Layer powers Virtual Me.

Virtual Me is a grounded RAG system inspired by DocumentCopilot.

The system is intentionally simplified by removing:

* Authentication
* Multi-user architecture
* Citations

Grounding remains mandatory.

---

# Virtual Me Architecture

```text
Visitor
   │
   ▼
Provide Name + Email
   │
   ▼
Create Session
   │
   ▼
Create Thread
   │
   ▼
User Question
   │
   ▼
Hybrid Retrieval
   │
   ▼
Relevant Knowledge
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

# Knowledge Base Architecture

Portfolio knowledge is stored as source documents.

---

## knowledge_documents

```text
id
title
source_type
content
created_at
updated_at
```

Examples:

* Resume
* Experience
* Projects
* Skills
* Photography
* Blender
* Professional Philosophy
* FAQs

---

## document_chunks

Stores chunked knowledge.

```text
id
document_id
content
chunk_index
embedding
metadata
created_at
```

---

# Chat Architecture

Authentication is intentionally excluded.

Visitors identify themselves using name and email.

The purpose is:

* Basic visitor identification
* Lead capture
* Conversation organization

The information does not require validation.

---

## chat_visitors

```text
id
name
email
created_at
last_active_at
```

---

## chat_threads

```text
id
visitor_id
title
created_at
updated_at
expires_at
```

A visitor can create multiple conversations.

Equivalent to ChatGPT chat history.

---

## chat_messages

```text
id
thread_id
role
content
created_at
```

Roles:

* user
* assistant
* system

---

# Retrieval Architecture

Virtual Me uses Hybrid Retrieval.

Hybrid Retrieval combines:

1. Vector Similarity Search
2. PostgreSQL Full Text Search

---

## Vector Search

Used for semantic similarity.

Powered by pgvector.

---

## Full Text Search

Used for keyword relevance.

Powered by PostgreSQL FTS.

---

## Rank Fusion

Results are merged using:

Reciprocal Rank Fusion (RRF)

---

# Grounding Architecture

Grounding is mandatory.

The assistant must answer only from retrieved context.

If sufficient information cannot be found:

```text
I don't have enough information about Atharva to answer that accurately.
```

should be returned.

Hallucinated information is considered a system failure.

---

# Media Architecture

Media files are stored in Supabase Storage.

Examples:

* Profile photos
* Project images
* Artwork
* Resume PDFs
* Videos

The database stores only metadata and URLs.

Binary assets never reside inside PostgreSQL.

---

# API Architecture

The backend exposes REST APIs.

Examples:

```text
/api/profile

/api/skills

/api/projects

/api/testimonials

/api/contact

/api/resume

/api/chat/start

/api/chat/thread

/api/chat/message
```

---

# Security Model

Portfolio 2.0 is intentionally public.

No visitor authentication exists.

Administrative access is managed through infrastructure-level controls.

Examples:

* Supabase access policies
* Environment variables
* Backend service permissions

---

# Observability

V1 uses lightweight observability.

Sources:

* Render logs
* Supabase logs
* Application logs

Dedicated monitoring platforms are intentionally excluded.

---

# Future Expansion

Potential future additions include:

* Admin dashboard
* Visitor analytics
* AI feedback collection
* Knowledge management tooling
* Multi-modal AI capabilities
* Additional portfolio experiences

The architecture must support these additions without requiring structural rewrites.

---

# Final Architectural Summary

Portfolio 2.0 consists of:

Frontend

* React
* TypeScript
* Vite
* Tailwind
* Motion
* React Three Fiber

Backend

* FastAPI
* Pydantic
* PydanticAI

Database

* Supabase PostgreSQL
* pgvector

Storage

* Supabase Storage

AI

* OpenAI
* Hybrid Retrieval
* Grounding Validation

Deployment

* Vercel
* Render
* Supabase

CI/CD

* GitHub Actions

The resulting architecture prioritizes:

* Authenticity
* Simplicity
* Extensibility
* Performance
* Long-term maintainability
* Alignment with the Portfolio 2.0 vision

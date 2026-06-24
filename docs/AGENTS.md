# Agent Instructions

This file is the source of truth for any coding agent (Claude Code, Cursor, Codex, OpenAI Codex, GitHub Copilot, or future AI coding assistant) working in this repository.

Read this document before making architectural, backend, frontend, database, AI, deployment, or design decisions.

---

# Governance Hierarchy

The project follows the following decision hierarchy:

1. PROJECT_CONSTITUTION.md
2. INFORMATION_ARCHITECTURE.md
3. ARCHITECTURE.md
4. AGENTS.md

If a lower-level document conflicts with a higher-level document, the higher-level document wins.

No implementation should violate the Constitution.

---

# Project Philosophy

Portfolio 2.0 is not a traditional portfolio website.

The portfolio itself is the product.

The goal is not to showcase projects.

The goal is to create a premium digital experience that authentically represents Atharva as:

* Engineer
* AI Builder
* Designer
* Artist
* Creator

Technical decisions should reinforce identity.

Not technical complexity.

When evaluating any implementation, ask:

"Does this make the experience feel more like Atharva?"

before asking:

"Is this technically impressive?"

---

# Stack

The stack is intentionally constrained.

Do not introduce alternatives without explicit approval.

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Motion
* Three.js
* React Three Fiber
* Drei
* TanStack Query

## Backend

* Python
* FastAPI
* Pydantic V2
* PydanticAI

## Database

* Supabase PostgreSQL
* pgvector
* PostgreSQL Full Text Search

## Storage

* Supabase Storage

## AI

* OpenAI Models
* OpenAI Embeddings

## Deployment

* Vercel
* Render
* Supabase

## CI/CD

* GitHub Actions

Stack is locked unless explicitly changed.

Do not propose alternatives without a stated reason.

---

# Architecture Principles

## Principle 1 — Clear Ownership

Frontend owns:

* UI
* Layout
* Components
* Animations
* Presentation logic
* User interactions

Backend owns:

* Content
* Data
* Media metadata
* AI context
* Business logic
* Retrieval logic
* Analytics

Content should originate from backend-managed sources.

Do not hardcode portfolio content in frontend components unless explicitly approved.

---

## Principle 2 — Simplicity

Avoid enterprise-style architecture.

Favor:

* Clarity
* Maintainability
* Extensibility
* Small modules

Avoid:

* Premature abstraction
* Deep inheritance
* Complex patterns
* Overengineering

---

## Principle 3 — Extensibility

Future additions should be additive.

New capabilities should not require major architectural rewrites.

---

## Principle 4 — Performance

Performance is a product requirement.

Animations and visual effects should never degrade responsiveness.

A beautiful experience that performs poorly is considered a failed implementation.

---

# Repository Structure

```text
portfolio-2.0/
├── PROJECT_CONSTITUTION.md
├── INFORMATION_ARCHITECTURE.md
├── ARCHITECTURE.md
├── AGENTS.md
│
├── backend/
│
├── frontend/
│
├── docs/
│
└── scripts/
```

Keep responsibilities obvious.

Avoid dumping unrelated functionality into large files.

---

# Dependency Policy

Default policy:

Write it yourself.

Only add a dependency when the problem is genuinely difficult or industry-standard tooling already exists.

Acceptable dependencies:

* FastAPI
* React
* Pydantic
* PydanticAI
* OpenAI SDK
* Supabase SDK
* Database drivers
* Migration tooling
* Animation tooling
* Three.js ecosystem

Avoid:

* Utility libraries replacing small helper functions
* Wrapper frameworks
* Abstraction layers on top of existing stack components
* Dependencies that exist only for convenience

Before introducing a dependency ask:

1. What problem does it solve?
2. Can this be implemented clearly in under 30 lines?
3. How frequently will it be used?
4. What maintenance burden does it add?

---

# Configuration Rules

A single settings module must be the source of truth.

Backend:

```python
settings.py
```

Frontend:

```typescript
env.ts
```

Rules:

* Do not access environment variables directly throughout the application.
* Do not call os.getenv() across the codebase.
* Do not call process.env throughout the frontend.
* Centralize configuration.

Applications should fail fast when required configuration is missing.

No silent fallbacks.

---

# Database Rules

Supabase PostgreSQL is the source of truth.

Do not introduce:

* MongoDB
* Firebase
* DynamoDB
* Separate vector databases

Vector search must use:

* pgvector

Keyword search must use:

* PostgreSQL Full Text Search

Hybrid retrieval must remain:

```text
Vector Search
+
Full Text Search
+
RRF
```

---

# Virtual Me Rules

Virtual Me is not a generic chatbot.

Virtual Me is a grounded AI representation of Atharva.

The purpose is:

* Answer questions about Atharva
* Explain projects
* Explain experience
* Explain skills
* Explain creative work
* Deepen understanding

The purpose is NOT:

* General-purpose assistant
* Search engine
* Productivity assistant

---

# Grounding Rules

Grounding is mandatory.

The system must answer from retrieved knowledge.

If information is unavailable:

Return an uncertainty response.

Example:

"I don't have enough information about Atharva to answer that accurately."

Hallucinations are considered defects.

Grounding should never be removed for convenience.

---

# Knowledge Base Rules

The knowledge base is the source of truth for Virtual Me.

Examples:

* Resume
* Projects
* Experience
* Skills
* Philosophy
* Photography
* Blender Work
* FAQs

Knowledge should be stored as documents and chunks.

Do not bypass retrieval by manually injecting large prompt context.

---

# API Philosophy

Prefer REST.

Example:

```text
/api/profile
/api/projects
/api/skills
/api/testimonials
/api/chat
```

Do not introduce GraphQL unless explicitly requested.

Keep APIs predictable.

---

# Frontend Philosophy

The frontend is responsible for experience.

The frontend should feel:

* Premium
* Crafted
* Responsive
* Human

Do not add animations for the sake of animation.

Every animation must support:

* Feedback
* Navigation
* Storytelling
* Spatial understanding

The desired reaction is:

"This feels incredible to use."

Not:

"Look at all these effects."

---

# 3D Philosophy

3D elements exist to strengthen identity.

Not to demonstrate technical capability.

Every 3D experience should justify:

* Why it exists
* What it communicates
* How it improves the experience

Remove decorative complexity.

---

# Code Style

## Small Functions

Prefer:

* Small functions
* Obvious names
* Direct implementation

Over:

* Clever abstractions
* Excessive inheritance
* Generic frameworks

---

## Error Handling

Validate at boundaries:

* HTTP requests
* Database writes
* External APIs
* User input

Do not add defensive code for impossible states.

---

## Comments

Comments should explain:

Why

not

What

Remove stale comments.

---

## File Organization

Prefer small focused modules.

Avoid giant files containing unrelated responsibilities.

---

# Future Expansion

The architecture is intentionally designed to support:

* Additional portfolio experiences
* New content types
* New AI capabilities
* Additional creative work
* Knowledge base growth

Implementations should preserve future flexibility without introducing complexity today.

---

# Final Rule

Portfolio 2.0 values:

Authenticity
→ Identity
→ Experience
→ Simplicity
→ Technology

in that order.

Technology exists to serve the experience.

Never the reverse.

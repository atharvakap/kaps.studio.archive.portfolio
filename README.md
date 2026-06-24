# Portfolio 2.0

> A premium digital experience that represents the intersection of engineering, AI, design, and artistic expression.

Portfolio 2.0 is not a traditional portfolio website.

It is a product designed to showcase identity through execution. Instead of simply listing projects, skills, and experience, the portfolio itself demonstrates craftsmanship, technical depth, creativity, and attention to detail through the experience it delivers.

---

## Vision

Portfolio 2.0 is designed to feel less like browsing a website and more like exploring a thoughtfully crafted digital space.

The goal is to help visitors understand:

* Who I am
* How I think
* How engineering and artistic expression coexist
* The depth behind my technical and creative work

The experience prioritizes authenticity, identity, and craftsmanship over self-promotion.

---

## Core Identity

Portfolio 2.0 represents a creator who combines:

* Software Engineering
* AI Engineering
* Data Engineering
* Backend Systems
* Design
* Motion Graphics
* Photography
* 3D Art
* Visual Storytelling

Rather than presenting these as separate disciplines, the portfolio unifies them into a single creative and technical identity.

---

## Information Architecture

The entire experience is organized around the creator rather than projects or technologies.

```text
I
│
├── Identity
├── Capabilities
├── Evidence
├── Interaction
└── Contact
```

### Identity

Who I am.

### Capabilities

What I can do.

### Evidence

Projects, experience, skills, and proof.

### Interaction

AI-powered Virtual Me and visitor engagement.

### Contact

Direct communication channels.

---

## Key Features

### Identity-First Experience

The portfolio prioritizes personal identity before projects, technologies, or achievements.

### Virtual Me

An AI-powered conversational experience that allows visitors to learn about me naturally through conversation.

Unlike generic chatbots, Virtual Me is a grounded AI representation built on personal knowledge, projects, experience, skills, and creative work.

### Content-Driven Architecture

Portfolio content is managed through the backend rather than being hardcoded into frontend components.

### Interactive Project Exploration

Projects serve as evidence of capability rather than the centerpiece of the experience.

### Creative Showcase

Photography, motion design, visual storytelling, and 3D work are integrated directly into the experience rather than isolated in separate sections.

---

## Technology Stack

### Frontend

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

### Backend

* FastAPI
* Python
* Pydantic V2
* PydanticAI

### Database

* Supabase PostgreSQL
* pgvector
* PostgreSQL Full Text Search

### Storage

* Supabase Storage

### AI

* OpenAI GPT Models
* OpenAI Embeddings
* Hybrid Retrieval (Vector + Keyword Search)
* Grounding Validation

### Deployment

* Vercel
* Render
* Supabase
* GitHub Actions

---

## System Architecture

```text
Visitor
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ├── Supabase PostgreSQL
   ├── pgvector
   ├── Supabase Storage
   └── OpenAI
```

---

## Virtual Me Architecture

```text
Visitor
   │
   ▼
Create Session
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

### Retrieval Pipeline

* pgvector semantic search
* PostgreSQL Full Text Search
* Reciprocal Rank Fusion (RRF)

Grounding is mandatory. The assistant only responds using retrieved knowledge and avoids hallucinated information.

---

## Design Principles

### Authenticity

Represent reality rather than exaggeration.

### Craftsmanship

Quality is demonstrated through execution.

### Simplicity

Avoid unnecessary complexity.

### Performance

Performance is a design requirement, not an afterthought.

### Extensibility

Future capabilities should be additive rather than disruptive.

### Coherence

Every feature should reinforce a single unified identity.

---

## Development Philosophy

```text
Authenticity
→ Identity
→ Experience
→ Craftsmanship
→ Technology
```

Technology exists to serve the experience.

Never the reverse.

---

## Roadmap

### Phase 1 — Foundation

* Information Architecture
* Technical Architecture
* Backend Foundation
* Frontend Foundation

### Phase 2 — Core Experience

* Identity Experience
* Capability Experience
* Evidence Experience
* Contact Experience

### Phase 3 — Virtual Me

* Knowledge Base
* Hybrid Retrieval
* Grounded Responses
* Conversation Experience

### Phase 4 — Craftsmanship

* Motion Design
* 3D Experiences
* Visual Storytelling
* Performance Optimization

### Phase 5 — Evolution

* Knowledge Expansion
* Additional Interactive Experiences
* AI Enhancements
* Content Growth

---

## Project Status

🚧 Currently under active development.

Portfolio 2.0 is being built as a long-term evolving platform that combines:

* Engineering
* AI
* Design
* Motion
* Storytelling
* Interactive Experiences

into a single cohesive digital product.

---

## Guiding Question

> "Does this make the experience feel more like me?"

Every architectural, design, and implementation decision is evaluated through that lens.

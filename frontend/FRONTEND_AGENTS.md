# Frontend — Agent Notes

This is the React frontend for Portfolio 2.0.

Read ../AGENTS.md first.

Project-wide rules live there.

This document defines frontend-specific conventions.

---

# Purpose

The frontend is the primary product surface of Portfolio 2.0.

It is not merely responsible for rendering data.

It is responsible for delivering the experience.

The frontend should communicate:

* Identity
* Craftsmanship
* Technical depth
* Creative depth
* Attention to detail

through execution.

Portfolio 2.0 is not a dashboard.

Portfolio 2.0 is not a CRUD application.

Portfolio 2.0 is not a collection of pages.

The frontend should feel like a thoughtfully crafted digital experience.

---

# Framework Rules

Portfolio 2.0 is a React SPA.

The architecture intentionally uses:

* React
* TypeScript
* Vite

Do not propose:

* Next.js
* SSR
* Server Components
* Remix
* Gatsby
* File-based routing frameworks

The architecture assumes a client-rendered application.

---

# Stack

## Core

* React
* TypeScript (Strict Mode)
* Vite

## Routing

* React Router

## Styling

* Tailwind CSS

## Components

* shadcn/ui

## Animation

* Motion

## 3D

* Three.js
* React Three Fiber
* Drei

## Data Fetching

* TanStack Query

Stack is intentionally constrained.

Do not introduce alternatives without justification.

---

# Package Manager

pnpm only.

Do not use:

* npm
* yarn

The lockfile is:

```text
pnpm-lock.yaml
```

If:

```text
package-lock.json
yarn.lock
```

appear in the repository,

remove them.

---

# Core Experience Principle

The desired visitor reaction is:

```text
"This feels incredible to use."
```

Not:

```text
"Look at all these animations."
```

The portfolio should feel:

* Premium
* Elegant
* Human
* Refined
* Intentional

Technology exists to support the experience.

Not the reverse.

---

# Architectural Boundaries

## Frontend Owns

* Layout
* Components
* Navigation
* Animations
* User interactions
* Presentation logic
* Client-side state
* Experience delivery

---

## Frontend Does Not Own

* Portfolio content
* Business logic
* AI logic
* Retrieval logic
* Knowledge management
* Analytics

These belong to the backend.

---

# Content Rules

Portfolio content originates from backend APIs.

Examples:

* Profile
* Skills
* Projects
* Testimonials
* Resume metadata

Avoid:

```typescript
const projects = [...]
const skills = [...]
```

inside components.

The frontend should not become the source of truth for content.

Content belongs to the backend.

Presentation belongs to the frontend.

---

# Project Structure

```text
frontend/
│
├── src/
│   │
│   ├── app/
│   │
│   ├── pages/
│   │
│   ├── features/
│   │
│   ├── components/
│   │
│   ├── layouts/
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │
│   ├── lib/
│   │
│   ├── types/
│   │
│   └── assets/
│
└── public/
```

---

# Feature Organization

Prefer:

```text
features/
│
├── profile/
├── projects/
├── skills/
├── testimonials/
├── virtual-me/
└── contact/
```

Group code by responsibility.

Avoid giant generic component folders.

---

# Imports

Use the alias system consistently.

Examples:

```typescript
@/components
@/features
@/services
@/lib
@/types
```

Avoid:

```typescript
../../../components/Button
../../../../services/api
```

Deep relative imports reduce maintainability.

---

# Component Philosophy

Components should be:

* Small
* Focused
* Reusable
* Easy to understand

Avoid giant components.

---

# Component Rules

One component per file.

Keep components reasonably small.

Break large components into smaller units.

Bad:

```text
PortfolioPage.tsx

2000+ lines
```

Good:

```text
HeroSection.tsx

ProjectExplorer.tsx

VirtualMePanel.tsx

ProfileCard.tsx
```

---

# State Management

Default:

* useState
* useReducer
* useContext
* TanStack Query

Do not introduce:

* Redux
* MobX
* Recoil

without strong justification.

Prefer simplicity first.

---

# Data Fetching

Use:

* TanStack Query

for server state.

Benefits:

* Caching
* Refetching
* Loading states
* Error states

Avoid manually rebuilding functionality already provided by TanStack Query.

---

# API Access

Backend communication must be centralized.

Use:

```text
services/
```

or

```text
lib/api/
```

Do not place:

```typescript
fetch(...)
```

or API logic inside UI components.

Components render.

Services fetch data.

---

# HTTP Rules

Use native fetch.

Do not install:

* axios
* ky
* got
* superagent

unless there is a clearly justified reason.

The browser already provides fetch.

---

# TypeScript

Strict mode is required.

Avoid:

```typescript
any
```

Prefer:

```typescript
unknown
```

plus proper narrowing.

Use:

* Explicit types
* Type guards
* Discriminated unions

Type safety is considered a product quality requirement.

---

# Styling Philosophy

Tailwind CSS is the default implementation tool.

Tailwind is preferred.

Tailwind is not a restriction.

The goal is not:

```text
Maximum Tailwind usage.
```

The goal is:

```text
Best possible experience.
```

Use Tailwind for most implementation.

Custom CSS is allowed when it significantly improves:

* Visual quality
* Animation systems
* Advanced effects
* 3D integration
* Maintainability

Avoid introducing multiple competing styling systems.

Tailwind should remain the primary approach.

---

# Design System Philosophy

The interface should feel:

* Premium
* Elegant
* Modern
* Human
* Crafted

Avoid:

* Enterprise dashboards
* Generic templates
* Cookie-cutter portfolio designs

The portfolio should feel authored.

Not assembled.

---

# UI Components

shadcn/ui is available as a utility library.

Use shadcn for:

* Accessibility primitives
* Dialogs
* Drawers
* Popovers
* Forms
* Tabs
* Command menus
* Common interaction patterns

Do not allow shadcn styling to dictate the Portfolio 2.0 visual identity.

Portfolio-specific experiences should be custom-built whenever they contribute meaningfully to:

* Identity
* Craftsmanship
* Experience

Craftsmanship takes priority over component reuse.

---

# Custom Components

Custom components are encouraged when they improve:

* Storytelling
* Visual identity
* Navigation
* Portfolio uniqueness
* Product quality

Examples:

Good candidates for custom implementation:

* Hero experiences
* Interactive project showcases
* Portfolio navigation systems
* Virtual Me interface
* Custom glass systems
* Spatial UI concepts
* Artistic experiences

Do not default to shadcn if it compromises the intended experience.

---

# Animation Philosophy

Motion is a design tool.

Not decoration.

Every animation should answer:

1. What information does this communicate?
2. Why does this movement exist?
3. What experience does it improve?

If the answer is:

```text
"It looks cool."
```

that is insufficient justification.

---

# Animation Rules

Prefer:

* Subtle transitions
* Layered motion
* Spatial continuity
* Meaningful feedback

Avoid:

* Constant motion
* Long animations
* Animation spam
* Large delays

Performance always wins.

---

# 3D Philosophy

3D exists to strengthen identity.

Not to demonstrate technical capability.

Every 3D scene should have a purpose.

Good:

* Artistic storytelling
* Hero experiences
* Environmental atmosphere
* Identity reinforcement

Bad:

* Random spinning objects
* Decorative complexity
* Technical demos without purpose

---

# React Three Fiber Rules

Keep scenes lightweight.

Prefer:

* Few high-quality assets
* Optimized Blender exports
* Efficient rendering

Avoid:

* Massive scene graphs
* Unoptimized assets
* Excessive draw calls

Performance is mandatory.

---

# Virtual Me Frontend Rules

Virtual Me is a major product surface.

It should feel integrated into Portfolio 2.0.

Not like embedding ChatGPT.

The experience should visually belong to the portfolio.

It should feel intentional.

Not bolted on.

---

# Performance Rules

Performance is a product requirement.

Priorities:

1. Fast load times
2. Smooth animations
3. Responsive interactions
4. Efficient rendering

Avoid unnecessary re-renders.

Lazy load heavy assets.

Code split where appropriate.

Performance is part of craftsmanship.

---

# Accessibility

Accessibility is required.

Minimum expectations:

* Keyboard navigation
* Focus visibility
* Semantic HTML
* ARIA where appropriate
* Sufficient contrast

Accessibility should not be deferred.

---

# Configuration

All environment variables must be accessed through:

```typescript
src/lib/env.ts
```

Do not access:

```typescript
import.meta.env
```

throughout the application.

Validate configuration at startup.

Fail fast when required configuration is missing.

---

# Backend Integration

The frontend communicates with a separate FastAPI backend over JSON.

The backend URL originates from:

```text
VITE_API_BASE_URL
```

All API access should be routed through:

```text
lib/api/
services/
```

Never pass credentials through component props.

---

# Testing

Prioritize:

* Type safety
* Simplicity
* Manual experience validation

Required validation:

```bash
pnpm tsc --noEmit
pnpm lint
```

Focus testing effort on:

* Critical user flows
* Virtual Me interactions
* Navigation
* API integrations

Avoid introducing large testing frameworks unless explicitly approved.

---

# Anti-Patterns

Do not:

* Read import.meta.env directly.
* Hardcode portfolio content.
* Put API calls inside UI components.
* Add HTTP libraries when fetch is sufficient.
* Use any to silence TypeScript.
* Mix multiple state libraries.
* Introduce Next.js.
* Introduce SSR.
* Add animations without purpose.
* Sacrifice performance for visual effects.
* Create massive page components.
* Let component libraries dictate the portfolio identity.

---

# Final Frontend Rule

The frontend is the face of Portfolio 2.0.

Every component, animation, interaction, transition, visual effect, and experience should reinforce:

```text
Authenticity
→ Identity
→ Experience
→ Craftsmanship
→ Technology
```

Technology serves the experience.

Never the reverse.

When choosing between:

```text
More reusable
```

and

```text
More authentic
```

prefer the solution that better represents the Portfolio 2.0 vision.

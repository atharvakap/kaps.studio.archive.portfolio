# FRONTEND_PROJECT_STRUCTURE.md

> **Project:** Portfolio 2.0
> **Status:** Architecture Document
> **Version:** 1.0
>
> This document defines the frontend folder structure, ownership boundaries,
> module responsibilities and architectural principles.
>
> It intentionally freezes the architectural organization of the frontend while
> allowing implementation details to evolve during development.

---

# Governance

This document follows the project governance hierarchy.

1. PROJECT_CONSTITUTION.md
2. INFORMATION_ARCHITECTURE.md
3. ARCHITECTURE.md
4. EXPERIENCE_ARCHITECTURE.md
5. FRONTEND_PROJECT_STRUCTURE.md

If any higher-level document conflicts with this document,
the higher-level document takes precedence.

---

# Philosophy

The frontend should be organized around responsibilities rather than pages.

Folders should represent systems.

Components should represent UI.

Business logic should remain independent from presentation.

The architecture should support long-term maintainability,
clear ownership and future extensibility.

---

# Core Principles

## Responsibility Driven

Folders represent responsibilities.

Never organize the project solely around routes or pages.

---

## Independent Systems

Every major frontend capability should own itself.

Changing one system should never require modifying unrelated systems.

---

## Low Coupling

Features communicate through well-defined interfaces.

Cross-folder dependencies should remain minimal.

---

## High Cohesion

Everything inside a folder should have a common purpose.

---

## Replaceability

Every system should be replaceable without affecting the overall architecture.

---

# Root Structure

```text
src/

├── app/
├── experience/
├── scene/
├── sections/
├── features/
├── ui/
├── shared/
├── services/
├── hooks/
├── stores/
├── lib/
├── assets/
├── styles/
├── types/
├── config/
├── constants/
├── utils/
└── main.tsx
```

---

# app/

Purpose

Application bootstrap.

Responsibilities

- Application providers
- Root layout
- Global initialization
- Context providers
- Router (if required)
- Error boundaries

Should never contain feature logic.

---

# experience/

Purpose

Owns the overall application experience.

Responsibilities

- Boot sequence
- Experience orchestration
- Section transitions
- Viewport state
- Navigation flow
- Future cinematic sequences

This folder controls the application journey.

It never owns UI components.

Example

```text
experience/

boot/

navigation/

transition/

viewport/

orchestrator/
```

---

# scene/

Purpose

Owns the physical world.

Version 1

- Background
- Paper
- Portrait
- Ambient composition

Future Versions

- React Three Fiber
- Blender assets
- Materials
- Shaders
- Advanced rendering

The Scene layer should never know about application content.

---

# sections/

Purpose

Implements every IA section.

Each folder owns only one section.

Example

```text
sections/

about/

experience/

projects/

skills/

gallery/

virtual-me/

contact/
```

Responsibilities

- Layout
- Local composition
- Section-specific interactions

A section must never manipulate another section.

---

# features/

Purpose

Cross-cutting application capabilities.

Features are reusable business capabilities rather than pages.

Example

```text
features/

assistant/

analytics/

navigation/

media/

theme/

search/
```

Responsibilities

- State
- Logic
- APIs
- Feature-specific components

---

# ui/

Purpose

Reusable presentation components.

Examples

```text
ui/

button/

card/

dialog/

glass/

tooltip/

badge/

input/

navigation/
```

Contains

- Generic UI
- Presentational components
- Shared layouts

Must never contain business logic.

---

# shared/

Purpose

Reusable project-wide resources.

Example

```text
shared/

components/

animations/

icons/

helpers/

validators/
```

Shared code should remain generic.

---

# services/

Purpose

Frontend service layer.

Responsibilities

- API communication
- Backend interaction
- Content fetching
- Media loading
- Analytics communication

Never contains UI.

---

# hooks/

Purpose

Reusable custom hooks.

Examples

```text
hooks/

useViewport()

useSection()

useTheme()

useMedia()

useKeyboard()
```

Hooks should encapsulate reusable behavior.

---

# stores/

Purpose

Global state management.

Contains

- UI state
- Experience state
- Navigation state
- Theme state

Should never store presentation logic.

---

# lib/

Purpose

External library wrappers.

Examples

```text
lib/

supabase/

motion/

react-query/

three/

```

External libraries should remain isolated.

If a library changes,
only this folder should require modification.

---

# assets/

Purpose

Static project assets.

Example

```text
assets/

images/

portrait/

paper/

icons/

fonts/

logos/

media/
```

Future

```text
assets/

models/

materials/

textures/
```

---

# styles/

Purpose

Global styling.

Contains

- Global CSS
- Variables
- Theme
- Utility styles

Component-specific styles should remain with their components.

---

# types/

Purpose

Global TypeScript types.

Contains

- API models
- Shared interfaces
- Utility types

---

# config/

Purpose

Application configuration.

Examples

```text
config/

theme.ts

navigation.ts

experience.ts

animation.ts
```

Configuration should remain declarative.

---

# constants/

Purpose

Application constants.

Examples

- Routes
- Keys
- IDs
- Static values

No business logic.

---

# utils/

Purpose

Pure utility functions.

Utilities

- Pure
- Stateless
- Easily testable

---

# Ownership Hierarchy

```text
Application

↓

Experience

↓

Scene

↓

Sections

↓

Features

↓

UI

↓

Shared Components
```

Lower layers should never control higher layers.

---

# Dependency Rules

Allowed

```text
Sections

↓

UI
```

Allowed

```text
Features

↓

Services
```

Allowed

```text
UI

↓

Shared
```

Avoid

```text
UI

↓

Features
```

Avoid

```text
Sections

↓

Other Sections
```

Avoid

```text
Experience

↓

Feature Internals
```

---

# Section Architecture

Every section should follow a consistent structure.

Example

```text
about/

index.ts

About.tsx

components/

hooks/

constants/

types/
```

Large sections may introduce

```text
animations/

layouts/

utils/
```

---

# Feature Architecture

Every feature should own itself.

Example

```text
assistant/

components/

hooks/

services/

store/

types/

utils/

index.ts
```

The feature should expose only its public interface.

Internal implementation should remain private.

---

# UI Component Architecture

Every reusable component should follow

```text
button/

Button.tsx

Button.types.ts

Button.styles.ts

index.ts
```

Complex components may contain

```text
hooks/

animations/

utils/
```

---

# Barrel Exports

Every folder should expose a single public interface.

Example

```text
index.ts
```

Consumers should never import internal files directly.

---

# Naming Conventions

Folders

kebab-case

```
virtual-me
```

Components

PascalCase

```
VirtualMe.tsx
```

Hooks

camelCase

```
useViewport.ts
```

Utilities

camelCase

```
formatDate.ts
```

Types

PascalCase

```
PortfolioProject.ts
```

Constants

UPPER_SNAKE_CASE

```
MAX_PROJECTS
```

---

# Component Principles

A component should have one responsibility.

Prefer composition over inheritance.

Avoid deeply nested components.

Keep rendering logic close to the component.

Move reusable logic into hooks.

---

# State Management Principles

Prefer

Local State

↓

Feature State

↓

Global State

Only promote state upward when genuinely shared.

Avoid unnecessary global state.

---

# Performance Principles

Lazy load where appropriate.

Avoid unnecessary re-renders.

Memoize only when beneficial.

Do not optimize prematurely.

Readability remains more important than micro-optimizations.

---

# Testing Philosophy

Business logic should be testable independently.

Utilities should remain pure.

Services should remain mockable.

UI should remain deterministic.

---

# Evolution Policy

This document freezes

- Folder hierarchy
- Module boundaries
- Ownership responsibilities
- Dependency direction
- Architectural philosophy

This document intentionally does NOT freeze

- Component count
- Internal implementation
- Library choices
- State management implementation details
- Styling strategy
- Animation implementation

These may evolve while respecting the architectural boundaries defined here.

---

# Future Expansion

Future versions may introduce

```text
scene/

materials/

rendering/

shaders/

physics/
```

without affecting the existing architecture.

The project should be able to grow naturally while preserving
the responsibility boundaries established in this document.

---

# Design Decision Log

Every significant architectural decision regarding the frontend structure
should be documented here.

The objective is to preserve architectural consistency throughout the
lifetime of the project and prevent unnecessary restructuring.
# FRONTEND_DESIGN.md

> Version: 1.0
> Status: Living Document
> Governing Documents:
>
> 1. PROJECT_CONSTITUTION.md
> 2. INFORMATION_ARCHITECTURE.md
> 3. ARCHITECTURE.md
> 4. FRONTEND_DESIGN.md

---

# Purpose

This document defines the frontend philosophy, visual language, interaction model and
experience architecture of Portfolio 2.0.

Unlike ARCHITECTURE.md, which defines how the application is engineered,
this document defines how the application should be experienced.

This document intentionally freezes the overall frontend philosophy,
experience architecture and interaction principles while allowing visual
polish to evolve naturally during implementation.

It should be treated as the source of truth for every frontend decision.

---

# Philosophy

Portfolio 2.0 is not designed to feel like a website.

It is not designed to imitate an operating system.

It is not intended to showcase visual effects.

It is intended to feel like an interactive piece of carefully crafted artwork.

Every interaction should reinforce that feeling.

Technology exists only to serve the experience.

---

# Experience Goal

The visitor should feel that they are discovering the creator rather than navigating a website.

The portfolio should communicate:

• Engineering Precision

• Artistic Craftsmanship

• Curiosity

• Simplicity

• Attention to Detail

---

# Overall Concept

The entire experience is built around a single physical metaphor.

The visitor is looking at a premium handcrafted paper canvas.

The paper is not merely a background.

It is the foundation of the experience.

Hidden beneath the paper is the creator's identity.

The About section is introduced by physically revealing that identity through
a carefully animated paper tear.

After this narrative introduction the portfolio behaves as a modern digital
application while continuing to preserve the illusion of physical materials.

---

# Material Language

The frontend is constructed from four primary materials.

## Paper

Represents permanence.

Foundation of the application.

Characteristics

- Premium cotton paper
- Warm white
- Visible fibres
- Very subtle watermark
- Matte finish
- Never glossy

Paper should feel valuable.

---

## Portrait

Represents identity.

The portrait exists beneath the paper.

It is revealed rather than displayed.

The portrait should feel like artwork rather than photography.

Future artistic interpretations are encouraged.

---

## Liquid Glass

Represents engineering.

Liquid Glass is not the visual identity.

It exists only as a modern interface layer.

Responsibilities

- Interactive controls
- Navigation
- Floating UI
- Panels
- Controls

It should remain visually restrained.

---

## Light

Lighting is environmental.

Lighting never follows the cursor.

Lighting exists to reveal material qualities.

Depth should be communicated through geometry rather than moving light sources.

---

# Motion Philosophy

Motion exists only when it communicates meaning.

Motion should never exist for decoration.

Every movement should feel physically believable.

---

# Narrative Architecture

The portfolio tells a story.

It should always follow this journey.

Visitor

↓

Terminal Boot Experience

↓

Workspace Initialisation

↓

Loading disappears

↓

Paper Canvas appears

↓

Paper tears open

↓

Portrait is revealed

↓

About section becomes visible

↓

Exploration begins

This sequence is considered part of the identity of Portfolio 2.0.

---

# About Experience

The About section is unique.

It is the only experience in which the paper is physically torn.

Purpose

Reveal the creator.

The tear is not a transition.

The tear is a narrative event.

---

# Navigation Philosophy

Leaving the About section causes the paper to seal itself.

Once sealed, the remaining sections transition using simple,
elegant application transitions.

The paper tear must never become a generic page transition.

Its narrative importance must be preserved.

---

# Physical World Rules

Every object obeys the same physical world.

Paper has thickness.

Paper bends.

Paper casts shadows.

Portrait remains still.

Glass remains stable.

Lighting remains ambient.

The camera remains fixed.

Only meaningful interactions introduce movement.

---

# Camera Philosophy

The camera is intentionally fixed.

Visitors should experience the composition exactly as designed.

Depth should emerge through

- Geometry
- Layering
- Shadows
- Material response

rather than camera movement.

---

# Interaction Philosophy

Interaction should feel like interacting with physical materials.

Desktop

Paper edges respond to pointer proximity.

Mobile

Paper edges respond to scrolling behaviour.

Interactions should remain subtle.

The illusion should never be broken.

---

# Motion Hierarchy

Narrative Motion

- Boot
- Paper Tear
- Paper Seal

Material Motion

- Paper edge response
- Liquid Glass interactions

Application Motion

- Section transitions
- Hover states
- Window animations

Decorative Motion

None.

If a motion has no purpose,
it should not exist.

---

# Frontend Architecture

The frontend consists of independent systems.

## Narrative System

Responsible for

- Boot sequence
- Tear animation
- Intro flow

---

## Material System

Responsible for

- Paper
- Shadows
- Materials
- Geometry
- Portrait

---

## Interaction System

Responsible for

- Hover interactions
- Scroll interactions
- Glass behaviour

---

## UI System

Responsible for

- Navigation
- Components
- Windows
- Forms

---

## Content System

Responsible for rendering application content.

The content layer should never own the physical world.

---

# Separation of Responsibilities

Blender

Responsible for

- Physical assets
- Paper mesh
- Tear animation
- Geometry
- Composition

React Three Fiber

Responsible for

- Rendering
- Scene
- Animation playback
- Runtime interaction

React

Responsible for

- UI
- Routing
- Data
- State
- API communication

Backend

Responsible for

- Content
- AI
- Media
- Configuration

---

# Component Independence

Every feature should be independently replaceable.

Changing a section should never require changing
the physical world.

Changing the physical world should never require changing
the backend.

No feature should have hidden dependencies on another.

---

# Performance Philosophy

Performance is part of the experience.

Effects should exist because they improve immersion,
not because they demonstrate technical capability.

The simplest implementation that preserves the illusion
should always be preferred.

---

# Non Goals

Portfolio 2.0 intentionally does not attempt to

- Replicate macOS
- Simulate a desktop operating system
- Showcase excessive visual effects
- Animate continuously
- Build interactions without narrative purpose

---

# Evolution Policy

This document freezes

- Philosophy
- Storytelling
- Material language
- Experience architecture
- Responsibilities
- Interaction hierarchy

This document intentionally does not freeze

- Colours
- Typography
- Iconography
- Animation timings
- Component layouts
- Spacing
- UI polish

These may evolve naturally during implementation
provided they do not violate the philosophy defined above.

---

# Design Decision Log

Every major frontend decision should be recorded here.

The goal is to prevent repeatedly revisiting previously
approved design decisions while still allowing thoughtful evolution.

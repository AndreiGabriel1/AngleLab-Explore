# AngleLab

AngleLab is a compact end-to-end system built around clear separation of concerns,
deterministic behavior, and explicit handling of failure cases.

The scope is deliberately small so the architecture stays easy to inspect and discuss.


---

## Phase 1 - Product Core (DONE)

What was built
- A pure domain model (`Angle`, `Idea`)
- A deterministic idea generator (`generateIdeas`)
- A schema layer for validating raw input
- An orchestrator responsible for control flow and state transitions
- A UI-agnostic ViewState model
- A minimal CLI consumer to prove the flow end-to-end

Why it matters
- runnable end-to-end
- invalid input is handled safely
- each layer has explicit ownership
- no premature decision logic in the core

---

## Phase 2 - Deterministic Rules Pipeline (DONE)

What was added
- A rules-only pipeline executed strictly after Phase 1 success:
  - `refineIdeas`
  - `rankIdeas`
  - `selectIdeas`
- Fully deterministic behavior
- A clear input/output contract
- Pipeline-owned explanatory notes
- Explicit degradation policies with no forced answers

Why it exists
Phase 2 introduces judgment without contaminating the core:
quality gates, prioritization, and the ability to explicitly return "no decision".

---

## Phase 3 - Consumers and Narrative (DONE)

Scope
- A Web consumer (Next.js) reusing the same core
- Minimal, targeted tests
- Architecture documentation
- Demo narrative for interviews

Phase 3 focuses on presentation and explainability, not new logic.

---

## What this project does not do (intentional)
- No AI integration
- No persistence
- No external services in the implemented system
- No UI logic inside core layers
- No feature creep

---

## How to run

Install (root):
- npm ci

CLI:
- npm run cli

Tests:
- npm run test

Typecheck:
- npm run typecheck

Web:
- npm run dev:web
- npm run build:web
- npm run start:web

---

## Project Status

- Phase 1: Complete (Product Core)
- Phase 2: Complete (Deterministic Rules Pipeline)
- Phase 3: Complete (Consumers + Docs)

This repository is intentionally scoped and considered interview-ready.
Future work would be additive and introduced behind new boundaries, without changing the core.

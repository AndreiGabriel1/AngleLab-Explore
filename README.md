# AngleLab

AngleLab is a small, end-to-end system built to demonstrate architectural judgment,
clear boundaries, and failure-first thinking.

The project prioritizes clarity and explainability over feature volume.

---

## Phase 1 — Product Core (DONE)

### What was built
- A pure domain model (`Angle`, `Idea`)
- A deterministic idea generator (`generateIdeas`)
- A schema layer for input validation
- An orchestrator that manages control flow and state transitions
- A UI-agnostic ViewState model
- A minimal CLI consumer

### Why it matters
Phase 1 establishes a stable foundation:
- runnable end-to-end,
- safe input handling,
- clean separation of concerns,
- no premature complexity.

---

## Phase 2 — Deterministic Rules Pipeline (DONE)

### What was added
- A rules-only pipeline executed after Phase 1 success:
  - `refineIdeas`
  - `rankIdeas`
  - `selectIdeas`
- Deterministic behavior with explicit failure handling
- A clear input/output contract
- Pipeline-owned explanatory notes
- Enterprise-minimal degradation policies

### Why it exists
Phase 2 introduces judgment without contaminating the core:
- quality gates,
- prioritization,
- explicit “no decision” outcomes.

---

## Phase 3 — Consumers & Narrative (IN PROGRESS)

### Scope
- Web consumer (Next.js)
- Minimal, high-signal tests
- Architecture documentation
- Interview-ready narrative

Phase 3 focuses on presentation and explainability, not new logic.

---

## What This Project Does Not Do (Intentionally)
- No AI integration
- No persistence
- No external services
- No UI logic inside core layers
- No feature creep

These constraints preserve clarity and defensibility.

---

## How to Use
- CLI: run the core flow end-to-end
- Web: visualize the same flow without duplicating logic

The same core is reused by all consumers.

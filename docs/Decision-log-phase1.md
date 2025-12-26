# AngleLab - Decision Log (Phase 1: Product Core)

This document captures the key Phase 1 decisions and the reasoning behind them.
Phase 1 is intentionally small. The goal is a complete, defensible core with clean boundaries.

---

## 1) What Phase 1 is

Phase 1 defines a minimal end-to-end product core:

- Domain:
  - `Angle` (string-literal union)
  - `Idea` (domain entity)
  - `generateIdeas(angle)` as a pure, deterministic generator
- Schema / Validation:
  - `parseAngle(raw: unknown)` turns raw input into a safe `Angle` or an explicit error
- Orchestration:
  - `loadIdeasForAngle(rawAngle)` connects input -> validation -> async simulation -> domain -> view state
- ViewState:
  - a UI-agnostic state model (`idle | loading | success | error`)
- Consumer:
  - a minimal CLI that renders the ViewState and proves the flow end-to-end

Outcome: the system can be demoed quickly without scrolling through code, and each layer has a single owner.

---

## 2) What Phase 1 is NOT (explicit exclusions)

Phase 1 intentionally excludes:

- AI integration or external services
- persistence (DB, caching, storage)
- UI frameworks or components
- ranking, selection, or any decision rules
- system design “heavy” work (scaling, distributed patterns, observability platforms)

Reason: keep the core easy to reason about and prevent early scope creep.

---

## 3) Key decisions and rationale

### Decision: keep the domain pure
- Domain functions are pure (no side effects).
- No validation inside the domain.
- No “smartness” or decision rules in the domain.

Rationale:
- Predictable behavior
- Reusable across consumers
- Easy to reason about (and to validate with small tests)

### Decision: validate raw input outside the domain
- `parseAngle` is the only place that converts raw input into a typed `Angle`.

Rationale:
- protects the domain from invalid data
- makes input failure a first-class, explainable outcome

### Decision: orchestration owns the workflow, not the business rules
- The orchestrator coordinates steps and transitions.
- It does not decide which ideas are “best”.

Rationale:
- avoids mixing workflow and policy
- keeps future extensions (Phase 2+) isolated

### Decision: ViewState is UI-agnostic
- A state container that can be rendered by CLI or Web without duplicating logic.

Rationale:
- enables multiple consumers
- keeps presentation concerns outside the core

### Decision: minimal CLI as the first real consumer
- The CLI proves the flow end-to-end and makes state transitions visible.

Rationale:
- fast feedback loop
- avoids UI distractions
- keeps Phase 1 demonstrable in minutes

---

## 4) Boundaries and ownership

- Domain owns meaning and deterministic generation.
- Schema owns validation from `unknown/string` to `Angle`.
- Orchestrator owns control flow and state transitions.
- ViewState owns representation of the flow for any consumer.
- Consumers own rendering and UX messaging only.

---

## 5) Phase 1 “done” criteria

Phase 1 is done when:

- the flow runs end-to-end (input -> state transitions -> output)
- invalid input produces a safe error state (no crashes)
- responsibilities are clearly separated and defensible
- the demo can be explained without digging through code

Phase 1 is the foundation. Decisions and rules belong in Phase 2, not here.

# AngleLab

AngleLab is a small, end-to-end system designed to demonstrate **architectural judgment**,
clear boundaries, and **failure-first thinking**.

The project intentionally prioritizes clarity and explainability over feature volume.
Every layer exists for a reason, and every omission is deliberate.

---

## Phase 1 — Product Core (DONE)

### What was built
- A pure domain model (`Angle`, `Idea`)
- A deterministic idea generator (`generateIdeas`)
- A schema layer for validating raw input
- An orchestrator responsible for control flow and state transitions
- A UI-agnostic ViewState model
- A minimal CLI consumer to prove the flow end-to-end

### Why it matters
Phase 1 establishes a stable foundation:
- runnable end-to-end,
- safe handling of invalid input,
- explicit ownership per layer,
- no premature decision logic or extensions.

The goal of Phase 1 is not sophistication, but **correct structure**.

---

## Phase 2 — Deterministic Rules Pipeline (DONE)

### What was added
- A rules-only pipeline executed strictly after Phase 1 success:
  - `refineIdeas`
  - `rankIdeas`
  - `selectIdeas`
- Fully deterministic behavior
- A clear input/output contract
- Pipeline-owned explanatory notes
- Explicit degradation policies with no fake confidence

### Why it exists
Phase 2 introduces judgment without contaminating the core:
- quality gates,
- prioritization,
- and the ability to explicitly say “no decision”.

All decision-making is isolated, explainable, and reversible.

---

## Phase 3 — Consumers & Narrative (DONE)

### Scope
- A Web consumer (Next.js) reusing the same core
- Minimal, high-signal tests
- Architecture documentation
- Interview-ready explanation and demo narrative

Phase 3 focuses on **presentation and explainability**, not new logic.

---

## What This Project Does Not Do (Intentionally)

- No AI integration
- No persistence
- No external services
- No UI logic inside core layers
- No feature creep

These constraints are deliberate and protect the architectural signal.

---

## How to Use

- **CLI**: run the full flow end-to-end and inspect pipeline decisions
- **Web**: visualize the same flow in the browser without duplicating logic

All consumers reuse the same core and orchestration layers.

---

## Project Status

- Phase 1 — Product Core: DONE
- Phase 2 — Deterministic Rules Pipeline: DONE
- Phase 3 — Consumers & Narrative: DONE

AngleLab is considered complete and interview-ready.

# AngleLab

AngleLab is a compact end-to-end system built around clear separation of concerns, deterministic behavior, and explicit handling of failure cases.

The scope is deliberately small so the architecture stays easy to inspect and discuss.

---

## Phase 1 - Product Core (DONE)

What was built:
- A pure domain model (`Angle`, `Idea`)
- A deterministic idea generator (`generateIdeas`)
- A schema layer for validating raw input
- An orchestrator responsible for control flow and state transitions
- A UI-agnostic ViewState model
- A minimal CLI consumer to prove the flow end-to-end

Why it matters:
- Runnable end-to-end
- Invalid input is handled safely
- Each layer has explicit ownership
- No premature decision logic in the core

---

## Phase 2 - Deterministic Rules Pipeline (DONE)

What was added:
- A rules-only pipeline executed strictly after Phase 1 success:
  - `refineIdeas`
  - `rankIdeas`
  - `selectIdeas`
- Fully deterministic behavior
- A clear input/output contract
- Pipeline-owned explanatory notes
- Explicit degradation policies with no forced answers

Why it exists:

Phase 2 introduces judgment without contaminating the core - quality gates, prioritization, and the ability to explicitly return "no decision".

---

## Phase 3 - Consumers and Narrative (DONE)

Scope:
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

Install:
```bash
npm ci
```

CLI:
```bash
npm run cli
```

Tests:
```bash
npm run test
```

Typecheck:
```bash
npm run typecheck
```

Web:
```bash
npm run dev:web    # development
npm run build:web  # production build
npm run start:web  # production server
```

---

## Architecture

The project uses a layered architecture where each layer has a clear responsibility.

**Consumers** (CLI/Web) only render state. They contain no business logic.

**ViewState** is UI-agnostic and has four states: `idle`, `loading`, `success`, `error`. This model works the same for CLI and web.

**Orchestrator** handles control flow. It validates input through the schema layer, executes the workflow, and produces ViewState.

**Schema** validates raw input before it reaches the core. Invalid angles are caught here and turned into error states.

**Domain** contains pure business logic. The `generateIdeas` function is deterministic - same input always produces the same output.

**Phase 2 Pipeline** applies rules after Phase 1 succeeds. Ideas flow through three stages:
1. **Refine** - Drop empty text, deduplicate, normalize whitespace
2. **Rank** - Score ideas based on angle keywords, break ties deterministically
3. **Select** - Apply threshold and top-N policies

Each stage produces diagnostic notes like `refine:dedup:2` or `rank:tie` so you can trace what happened.

### Failure Handling

The system handles edge cases explicitly:

**Invalid input** - Schema validation fails, orchestrator produces an error ViewState with a message.

**Degradation** - If refining removes all ideas, the system falls back to showing Phase 1 results. Notes explain what happened: `refine:all_removed`, `degrade:phase1_only`.

**No decision** - If ranking produces low-confidence scores, selection returns empty with notes: `rank:low_signal`, `select:no_decision`. No forced answers.

---

## Testing

Run the test suite:
```bash
npm run test
```

Tests cover schema validation, pipeline determinism, and edge case handling. The focus is on contracts and failure modes rather than implementation details.

This keeps the test suite small and maintainable while proving the architecture works as designed.

---

## Project Status

- Phase 1: Complete (Product Core)
- Phase 2: Complete (Deterministic Rules Pipeline)
- Phase 3: Complete (Consumers + Docs)

This repository is intentionally scoped and considered interview-ready. Future work would be additive and introduced behind new boundaries, without changing the core.
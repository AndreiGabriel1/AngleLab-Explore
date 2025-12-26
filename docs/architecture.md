# AngleLab — Architecture Overview

## Purpose
AngleLab is a deliberately small but complete system meant to show clean boundaries,
deterministic behavior, and controlled failure handling.

The focus is structure and explainability, not feature volume.

---

## High-Level Structure
AngleLab is organized into three phases, each with a distinct responsibility:

- Phase 1 — Product Core
  - Pure domain logic
  - Input validation
  - Orchestration
  - ViewState modeling

- Phase 2 — Deterministic Rules Pipeline
  - Quality gates
  - Decision rules
  - Ranking and selection
  - Notes and degradation policy

- Phase 3 — Consumers & Narrative
  - CLI and Web consumers (Next.js)
  - Minimal, targeted tests
  - Documentation and demo script

Each phase builds on the previous one without mutating or contaminating it.

---

## Layered Architecture & Ownership

### 1) Domain (Phase 1)
Owns:
- Business meaning
- Deterministic data generation

Components:
- `Angle` (union type)
- `Idea` (domain entity)
- `generateIdeas(angle)`

Rules:
- Pure functions only
- No validation
- No decision logic
- No side effects

The domain produces data and nothing else.

---

### 2) Schema / Validation (Phase 1)
Owns:
- Validation of raw input

Component:
- `parseAngle(raw: unknown)`

Rules:
- Converts raw input into safe, typed domain input
- Returns explicit success or error
- Protects the domain from invalid data

Validation stays outside the domain to preserve domain purity.

---

### 3) Orchestrator (Phase 1)
Owns:
- Control flow
- State transitions
- Composition of steps

Component:
- `loadIdeasForAngle(rawAngle)`

Responsibilities:
- Validate input via the Schema layer
- Control async flow (simulated delay)
- Call domain logic
- Produce a `ViewState`

The orchestrator coordinates the flow but does not make business decisions.

---

### 4) ViewState (Phase 1)
Owns:
- Representation of the application flow

States:
- `idle`
- `loading`
- `success`
- `error`

Rules:
- UI-agnostic
- No logic
- No decisions
- State representation only

ViewState allows multiple consumers to exist without duplicating logic.

---

### 5) Phase 2 Pipeline (Deterministic Rules)
Judgment isolated from the core.

Owns:
- Decision-making logic
- Quality control
- Failure explanations (notes)

Input:
- `ctx` (context, e.g. angle treated as an opaque string hint)
- `PipelineIdea[]` (adapted from domain ideas)

Stages:
1. `refineIdeas`
   - Normalize text
   - Drop invalid or empty items
   - Deduplicate deterministically
2. `rankIdeas`
   - Apply a deterministic heuristic score
   - Detect tie and low-signal cases
3. `selectIdeas`
   - Apply an explicit selection policy (threshold + top N)
   - Allow empty selection (no forced answers)

Key rules:
- Fully deterministic
- No crashes on edge cases
- No mutation of Phase 1 objects
- Notes are pipeline-owned (consumers only render)

---

## Failure & Degradation Strategy
Failure is treated as a first-class outcome, not an exception.

Examples:
- No ideas after refinement -> degrade to Phase 1 output
- All scores equal -> deterministic ordering + `rank:tie`
- Low signal -> `rank:low_signal`
- No selection possible -> `select:no_decision`

The system explicitly communicates why no decision was made.

---

## Data Flow

### Consumer Flow (CLI and Web)
High-level flow:
- User input (raw angle) -> consumer (CLI/Web)
- Consumer -> `loadIdeasForAngle(rawAngle)`
- Orchestrator -> `parseAngle(raw)` -> error ViewState OR success flow
- Success flow -> `generateIdeas(angle)` -> success ViewState
- After Phase 1 success -> adapter `toPipelineIdeas(domainIdeas)`
- Phase 2 -> `runPhase2Pipeline(ctx, ideas)` -> refined/ranked/selected + notes
- Consumer renders Phase 1 output + Phase 2 output + notes

The same core flow is reused by both CLI and Web consumers without duplicating logic.

---

## Trade-offs (Intentional)
- No AI integration (rules-only, deterministic)
- No persistence
- No external services in the implemented system
- No UI logic inside core layers
- Limited scope to preserve clarity

These trade-offs are deliberate to keep the system explainable and defensible.

---

## Optional Slices (Design-only, not implemented)

### Optional Slice A — External Ideas Source Boundary
Intent:
- Introduce an external source (API/service/AI later) without contaminating the core.

Boundary:
- Orchestrator -> `ExternalIdeasSource` (adapter/gateway) -> `safeFetch`

Ownership:
- Domain stays pure
- Adapter isolates instability (timeouts/retries/error mapping)
- Orchestrator decides degradation (fallback to local ideas vs error state)

Trade-off:
- Adds real failure modes and reliability policy surface area, so it is intentionally out of scope for this version.

### Optional Slice B — Observability Boundary
Intent:
- Make decisions inspectable in production (events/metrics), without pushing logging into domain/pipeline code.

Boundary:
- Consumer or Orchestrator emits structured events based on:
  - ViewState transitions
  - Phase 2 notes (`refine:*`, `rank:*`, `select:*`, `degrade:*`)

Trade-off:
- Useful in production, but unnecessary for a small, interview-oriented codebase.

---

## What Would Change in Production
- Replace heuristics with learned models or external services
- Introduce persistence and caching
- Add observability and metrics (optional slice above)
- Strengthen schema validation at boundaries
- Introduce concurrency/performance work only after real bottlenecks exist

These concerns are intentionally excluded from this implementation.

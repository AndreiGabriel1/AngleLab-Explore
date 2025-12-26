# AngleLab — Architecture Overview

## Purpose
AngleLab is a deliberately small but complete system built to demonstrate
architectural judgment rather than feature volume.

The goal is to show how a product can be structured from input to output with:
- clear ownership boundaries,
- deterministic behavior,
- failure-first thinking,
- and explicit trade-offs.

The system is intentionally minimal, explainable, and extensible without being over-engineered.

---

## High-Level Structure

AngleLab is organized into three phases, each with a distinct responsibility:

- **Phase 1 — Product Core**
  - Pure domain logic
  - Input validation
  - Orchestration
  - ViewState modeling

- **Phase 2 — Deterministic Rules Pipeline**
  - Quality gates
  - Decision rules
  - Ranking and selection
  - Failure and degradation handling

- **Phase 3 — Consumers & Narrative**
  - CLI and Web consumers
  - Minimal, high-signal testing
  - Documentation and interview narrative

Each phase builds on the previous one without mutating or contaminating it.

---

## Layered Architecture & Ownership

### 1) Domain (Phase 1)
**Owns:**
- Business meaning
- Deterministic data generation

**Components:**
- `Angle` (union type)
- `Idea` (domain entity)
- `generateIdeas(angle)`

**Rules:**
- Pure functions only
- No validation
- No decision logic
- No side effects

The domain produces data and nothing else.

---

### 2) Schema / Validation (Phase 1)
**Owns:**
- Validation of raw input

**Components:**
- `parseAngle(raw: unknown)`

**Rules:**
- Converts raw input into safe, typed domain input
- Returns explicit success or error
- Protects the domain from invalid data

Validation is intentionally kept outside the domain.

---

### 3) Orchestrator (Phase 1)
**Owns:**
- Control flow
- State transitions
- Composition of steps

**Components:**
- `loadIdeasForAngle(rawAngle)`

**Responsibilities:**
- Validate input via the Schema layer
- Control async flow (simulated delay)
- Call domain logic
- Produce a `ViewState`

The orchestrator coordinates the flow but does not make business decisions.

---

### 4) ViewState (Phase 1)
**Owns:**
- Representation of the application flow

**States:**
- `idle`
- `loading`
- `success`
- `error`

**Rules:**
- UI-agnostic
- No logic
- No decisions
- State representation only

ViewState allows multiple consumers to exist without duplicating logic.

---

### 5) Phase 2 Pipeline (Deterministic Rules)
**Owns:**
- Decision-making logic
- Quality control
- Failure explanations

**Input:**
- `ctx` (context, e.g. angle — treated as opaque)
- `PipelineIdea[]` (adapted from domain ideas)

**Stages:**
1. `refineIdeas`
   - Normalize text
   - Drop invalid or empty items
   - Deduplicate deterministically
2. `rankIdeas`
   - Apply a deterministic heuristic score
   - Detect ties and low-signal cases
3. `selectIdeas`
   - Apply an explicit selection policy (threshold + top N)
   - Allow empty selection (no fake confidence)

**Key Rules:**
- Fully deterministic
- No crashes
- No mutation of Phase 1 objects
- Notes are pipeline-owned

---

## Failure & Degradation Strategy

Failure is treated as a first-class outcome, not an exception.

Examples:
- No ideas after refinement → degrade to Phase 1 output
- All scores equal → deterministic ordering + `rank:tie`
- Low signal → `rank:low_signal`
- No selection possible → `select:no_decision`

The system explicitly communicates why it could not decide.

---

## Data Flow

### Consumer Flow (CLI and Web)

1. The user provides an input angle through a consumer (CLI or Web).
2. The consumer forwards the raw input to the orchestrator.
3. The orchestrator validates the input using the schema layer.
4. If validation fails, an error ViewState is returned.
5. If validation succeeds:
   - the orchestrator enters a loading state,
   - calls the domain to generate ideas,
   - and returns a success ViewState.
6. The consumer renders the Phase 1 output.
7. After a successful Phase 1 run, the Phase 2 pipeline is executed.
8. The consumer renders the selected results and pipeline notes.

The same core flow is reused by both CLI and Web consumers without duplicating logic.

---

## Trade-offs (Intentional)

- No AI integration (rules-only, deterministic)
- No persistence
- No external services
- No UI logic inside core layers
- Limited scope to preserve clarity

These trade-offs are deliberate to keep the system explainable and defensible.

---

## What Would Change in Production

- Replace heuristics with learned models or external services
- Introduce persistence and caching
- Add observability and metrics
- Strengthen schema validation at boundaries
- Introduce concurrency and performance optimizations

These concerns are intentionally excluded from this implementation.

# Phase 2 - Interview Anchors

This document contains interview-facing explanations for Phase 2.
It focuses on why the design exists and what boundaries it introduces.

---

## Slice 1 - Deterministic Rules Pipeline (implemented)

### Problem it solves
Phase 1 produces “raw” output. In real systems, raw output usually needs an intermediate layer that:
- normalizes and cleans data
- applies basic quality gates
- ranks and selects using explicit rules
- can say “no decision” instead of guessing

This is a product need, but it should not contaminate the core.

### Why this is not Phase 1
Phase 1 is about a stable product core and clean boundaries.
If decision rules enter too early:
- responsibilities get blurred
- the core becomes harder to reason about
- the system becomes harder to defend

So Phase 2 is an extension layer with strict scope limits.

### Boundary introduced
A rules pipeline that sits after Phase 1 success:

- Phase 1 produces ideas and a ViewState.
- Phase 2 transforms Phase 1 output through deterministic stages:
  - `refineIdeas`
  - `rankIdeas`
  - `selectIdeas`

Ownership:
- Domain remains pure and unchanged.
- Phase 2 owns judgment (rules and policies).
- Consumers render results and notes, but do not invent explanations.

### Key design choices (what to emphasize)
- rules-only, no AI, no randomness
- fully deterministic ordering (including tie-break rules)
- explicit notes explaining what happened (`refine:*`, `rank:*`, `select:*`, `degrade:*`)
- allowed to return empty selection (“no decision”) rather than fake confidence
- safe degradation policy (fall back to Phase 1 output)

### Trade-off (intentional)
Pros:
- judgment is isolated and explainable
- easy to test and reason about
- safe behavior under low signal

Cons:
- limited sophistication by design
- requires discipline to avoid turning it into a rules platform

---

## Slice 2 - External Ideas Source Boundary (design-only)

### Status
Design-only. Not implemented by choice.

### Problem it addresses
In production, ideas often come from external sources (APIs, internal services, or AI later).
External sources introduce failure modes:
- network errors
- timeouts
- rate limits
- partial or invalid responses

A clean architecture needs a boundary that absorbs instability.

### Why it is not implemented here
It adds a lot of complexity and expands the failure surface area.
For this project, the goal is to demonstrate core boundaries and deterministic judgment,
not to build a reliability platform.

### Intended boundary
An adapter/gateway that isolates external instability:

- Orchestrator calls `ExternalIdeasSource` (adapter)
- Adapter handles `safeFetch` and error mapping
- Orchestrator decides degradation strategy:
  - fall back to local deterministic ideas, or
  - return an explicit error state

Ownership:
- Domain stays pure
- Adapter isolates instability
- Orchestrator owns degradation decisions

### Trade-off (intentional)
Pros:
- enterprise-style boundary for external instability
- clear ownership of failure and fallback behavior

Cons:
- significant scope increase
- not needed for an interview-oriented minimal codebase

---

## How to pitch Phase 2 in one line
Phase 2 adds decision-making as a deterministic, testable layer that never contaminates the product core,
and it can explicitly return “no decision” with reasons instead of guessing.

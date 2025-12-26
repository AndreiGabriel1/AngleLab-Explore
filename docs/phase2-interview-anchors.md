# Phase 2 - Interview Anchors

This document is interview-facing.
It explains why Phase 2 exists and what boundaries it introduces, without relying on implementation details.

---

## Slice 1 - Deterministic Rules Pipeline (Implemented)

### Problem
Phase 1 produces raw ideas.
In a real product, raw output is rarely ready for presentation or decision-making.

You typically need:
- Normalization and basic quality rules
- Prioritization
- A safe way to say "no decision" instead of guessing

### Why this is not Phase 1
Phase 1 is the Product Core: stable flow, clean boundaries, and predictable state transitions.
Introducing rules and policy too early would:
- Blur ownership between layers
- Increase decision surface area
- Make the core harder to reason about and defend

Phase 2 is an extension layer by design.

### Boundary introduced
Phase 2 adds a rules pipeline between Domain output and the consumer.

Core flow:
- Phase 1 generates domain ideas
- Phase 2 refines, ranks, and selects using deterministic rules
- The consumer renders results and notes

Ownership:
- Domain generates data only
- Pipeline applies rules and explains outcomes
- Consumer renders output (no business logic)

### Key design choices
- Rules-only (no AI, no external calls)
- Fully deterministic behavior
- Explicit failure handling via notes
- No forced answers under low signal
- Pipeline owns notes (UI does not invent explanations)

### Trade-off
Pros:
- A clear judgment layer without contaminating the core
- Explainable behavior under edge cases
- Stable, testable decision rules

Cons:
- Limited sophistication (by intent)
- Requires discipline to avoid feature creep in the pipeline

---

## Slice 2 - External Source Integration Boundary (Design-only)

### Status
Design-only. Not implemented in this version.

### Problem
In production, ideas often come from external sources:
- APIs
- Internal services
- AI systems (later)

Those sources add real failure modes:
- Timeouts
- Rate limits
- Network instability
- Partial responses

### Why it is not implemented here
Adding external instability too early would:
- Contaminate the Product Core
- Expand scope without increasing interview signal
- Shift the project into reliability engineering instead of boundary clarity

This slice exists as a design discussion, not as code.

### Intended boundary
Introduce a gateway/adapter boundary that isolates instability:

- Orchestrator -> ExternalIdeasSource (adapter) -> SafeFetch (timeout/retry/error mapping)

Ownership:
- Domain stays pure
- Adapter owns interaction with the external source and maps failures
- Orchestrator owns degradation strategy (fallback vs error state)

### Trade-off
Pros:
- Clear ownership of failures
- A production-ready reliability boundary

Cons:
- Significant complexity
- Out of scope for a small, interview-focused system

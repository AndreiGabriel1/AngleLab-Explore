# Phase 2 — Interview Anchors

This document contains interview-facing explanations for Phase 2.
It focuses on design reasoning rather than implementation details.

---

## Slice #1 — Deterministic Rules Pipeline (Implemented)

### Problem
Phase 1 produces ideas in a raw form.
In real systems, raw output is rarely suitable for presentation or decision-making.

A system needs:
- normalization,
- quality rules,
- prioritization,
- and the ability to explicitly say “I cannot decide”.

---

### Why This Is Not Phase 1
Phase 1 establishes a stable Product Core with clean boundaries.
Introducing rules and decisions too early would:
- blur responsibilities,
- increase complexity,
- and reduce clarity.

Phase 2 exists as an explicit extension layer.

---

### Boundary Introduced
A rules pipeline between Domain and Consumer:

- Domain generates ideas
- Pipeline refines, ranks, and selects
- Consumer renders the result

Ownership:
- Domain remains pure and deterministic
- Pipeline transforms and decides
- Consumer performs no logic

---

### Key Design Decisions
- Rules-only (no AI)
- Fully deterministic
- Explicit failure handling
- No fake confidence
- Notes are pipeline-owned

---

### Trade-off
**Pros:**
- Clear judgment layer
- Explainable decisions
- Safe failure behavior

**Cons:**
- Limited sophistication
- Requires discipline to avoid feature creep

This trade-off is intentional.

---

## Slice #2 — External Source Integration (Design Only)

### Status
Design-only. Not implemented intentionally.

---

### Problem
Real systems often integrate external sources:
- APIs
- internal services
- AI systems

These introduce failure modes:
- network errors
- timeouts
- rate limits
- partial data

---

### Why It Is Not Implemented
Introducing external instability too early would:
- contaminate the Product Core,
- distract from architectural clarity,
- increase scope without increasing signal.

This slice exists purely as a design discussion.

---

### Intended Boundary

- Orchestrator
- ExternalIdeasSource (Adapter)
- SafeFetch

Ownership:
- Domain remains pure
- Adapter isolates instability
- Orchestrator decides degradation strategy

---

### Trade-off
**Pros:**
- Enterprise-grade reliability model
- Clear failure ownership

**Cons:**
- Significant complexity
- Out of scope for a demonstrative project

This slice is intentionally postponed.

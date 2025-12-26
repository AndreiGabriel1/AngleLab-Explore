# AngleLab - Decision Log (Phase 1: Product Core)

## 1) What Phase 1 is
Phase 1 defines a minimal, end-to-end Product Core:
- **Domain**: a pure model (`Angle`, `Idea`) + a deterministic generator (`generateIdeas(angle)`).
- **Validation (Schema)**: parsing raw input into a valid `Angle` (`parseAngle`), returning a safe result.
- **Orchestration**: `loadIdeasForAngle(rawAngle)` that connects input → validation → async simulation → domain → view state.
- **ViewState**: a UI-agnostic state container that represents the flow (`idle | loading | success | error`).
- **Consumer (UI-min)**: a minimal CLI consumer that renders ViewState and proves the flow end-to-end.

**Outcome:** the product is runnable and explainable end-to-end (input -> state transitions -> output), with clean boundaries.

---

## 2) What Phase 1 is NOT (explicit)
Phase 1 intentionally excludes:
- Any real AI integration (external calls, ranking models, prompt logic)
- Any React / UI framework (no web UI, no components)
- Advanced features or extensions (filters, persistence, multi-tenant, accounts)
- Optimizations (caching strategy, performance tuning)
- System design heavy work (scaling, reliability layers, distributed patterns)

**Reason:** protect scope and keep the Product Core small, stable, and demonstrable.

---

## 3) Why we stop here (scope discipline)
Phase 1 stops when:
- The core flow is complete and runnable
- Each layer has a clear responsibility and boundary
- Invalid input is handled safely without corrupting the domain
- The system can be demoed in minutes and explained in seconds

This is the minimal foundation that prevents premature complexity.

---

## 4) Boundaries & ownership (who does what)
- **Domain** owns business meaning and deterministic behavior (pure functions).
- **Schema** owns validation from `unknown/string` → typed domain input (`Angle`).
- **Orchestrator** owns the workflow and state transitions.
- **ViewState** owns representation of the flow for any consumer.
- **Consumer** owns rendering and UX messaging (only presentation).

---

## 5) Interview narrative 
I deliberately closed Phase 1 as a small, but complete Product Core:
- runnable end-to-end,
- clean separation of concerns,
- safe input handling,
- minimal UI to prove the flow,
- with intentional constraints to avoid premature complexity.

Phase 1 is “DONE” when it can be demoed and defended clearly.

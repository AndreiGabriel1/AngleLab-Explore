# AngleLab — Demo Script (2–3 minutes)

## Goal
Demonstrate architectural judgment, clean boundaries, and failure-first thinking,
without scrolling through code.

---

## Step 1 — What this project is (15–20s)

AngleLab is a small but complete system built to show how I structure a product
from input to output with clear ownership boundaries.

The focus is not features, but:
- determinism,
- explainability,
- and controlled failure.

---

## Step 2 — Phase 1: Product Core (30–40s)

Phase 1 is a minimal end-to-end core.

Flow:
- user provides an angle,
- input is validated,
- ideas are generated deterministically,
- state is represented via a ViewState.

Important points:
- the domain is pure,
- validation lives outside the domain,
- orchestration controls flow but makes no decisions,
- consumers only render state.

This phase proves the system works end-to-end.

---

## Step 3 — Phase 2: Rules Pipeline (45–60s)

Phase 2 adds judgment without touching the core.

After Phase 1 succeeds:
- ideas are refined (cleaned and deduplicated),
- ranked deterministically,
- and selected using an explicit policy.

Key point:
the system is allowed to return **no selection**.

If it cannot decide, it says so explicitly and explains why via notes.

There is no AI and no randomness. Everything is deterministic and explainable.

---

## Step 4 — Failure-first behavior (20–30s)

Failure is a valid outcome:
- low signal,
- ties,
- empty input,
- no confident selection.

Instead of guessing, the system degrades safely
and communicates the reason.

This avoids fake confidence.

---

## Step 5 — Consumers (20–30s)

The same core is consumed by:
- a CLI,
- and a minimal Web UI (Next.js).

No logic is duplicated.
Consumers only render outputs produced by the core.

---

## Closing (10–15s)

This project is intentionally small.
It is designed to be explained clearly in minutes
and defended in an interview without scrolling through code.

# AngleLab - Demo Script

## 60-90 seconds (default)

Goal: show a small end-to-end system with clear boundaries and deterministic behavior.

1) What it is (10-15s)
AngleLab is a compact system that goes from raw input to output through explicit layers.
It is small on purpose: the point is structure and decision isolation, not feature surface area.

2) Phase 1 - Product Core (20-25s)
Phase 1 takes a raw angle string, validates it, runs a deterministic idea generator, and returns a ViewState.
Key boundary rules:
- domain generates data only (no validation, no decisions)
- schema validates raw input
- orchestrator handles control flow and state transitions
- consumers render the ViewState

3) Phase 2 - Deterministic rules (25-30s)
After a successful Phase 1 run, Phase 2 runs a rules-only pipeline: refine -> rank -> select.
It is deterministic, produces notes, and it is allowed to return "no decision" instead of guessing.

4) Consumers (10-15s)
The same core is consumed by a CLI and a minimal Next.js page.
No business logic lives in the UI.

Close (5s)
That is the whole project: deterministic behavior, explicit ownership, and safe outcomes under low signal.


## 2-3 minutes (extended)

Goal: demonstrate the boundaries, then show one "happy path" and one "no decision" path.

Step 1 - What this project is (15-20s)
AngleLab is a small end-to-end system that I built to show how I separate concerns:
validation, orchestration, domain behavior, and decision rules.
I kept it intentionally tight so it can be explained quickly and defended without digging through code.

Step 2 - Show Phase 1 flow in the CLI (40-60s)
- Run the CLI and input an invalid angle to show the error state.
- Input a valid angle to show success.
What to point out:
- schema is the only place that turns raw input into a valid Angle
- orchestrator drives the state flow (idle -> loading -> success/error)
- domain is pure and deterministic
- ViewState is consumer-agnostic, so multiple consumers can reuse the same flow

Step 3 - Show Phase 2 behavior (45-60s)
After Phase 1 success, Phase 2 runs:
- refineIdeas: normalizes text, drops empty, dedupes deterministically
- rankIdeas: deterministic heuristic scoring, stable tie-break by id
- selectIdeas: explicit policy (threshold + top N), and it can return an empty selection
Important point:
If selection is empty, the pipeline explains why via notes (for example: low signal or tie),
and the system can safely fall back to Phase 1 output. No guessing.

Step 4 - Web consumer (20-30s)
Open the Next.js page.
Show that it renders the same outputs (Phase 1 ideas + Phase 2 results and notes).
Call out the boundary rule: the UI is wiring and rendering only.

Close (10-15s)
This is not a feature project. It is a systems-structure project:
deterministic behavior, decision isolation, and explicit failure handling.

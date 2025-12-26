# AngleLab - Demo Script

Designed to be delivered without scrolling through code.
Use the short version by default. Use the extended version if you have time.

---

## Short version (60-90 seconds)

AngleLab is a compact end-to-end system built to demonstrate clean boundaries,
deterministic behavior, and explicit failure handling.

It takes raw input, validates it, runs a deterministic idea generator, and returns a UI-agnostic state.
On top of that, a second layer applies rules for refinement, ranking, and selection without touching the core.

Phase 1 is the Product Core:
- Schema validates raw input (`parseAngle`) and returns a safe result or an explicit error.
- Orchestration (`loadIdeasForAngle`) owns the workflow and state transitions.
- Domain (`generateIdeas`) is pure and deterministic: no validation, no policy, no side effects.
- ViewState models the flow (`idle / loading / success / error`) and is reusable across consumers.

After Phase 1 succeeds, Phase 2 runs a rules-only pipeline: refine, rank, select.
It is deterministic, produces notes, and it is allowed to return "no decision" instead of guessing.

The same core is consumed by a CLI and a minimal Next.js page.
The UI only renders outputs; it does not contain business rules.

That is the whole project: predictable behavior, decision isolation, and safe outcomes under low signal.

---

## Extended version (2-3 minutes)

Start with the boundaries, then show one normal path and one low-signal path.

1) Phase 1 in the CLI
- Run the CLI.
- Enter an invalid angle to show an explicit error state.
- Enter a valid angle to show a success state and deterministic output.

What to point out:
- Schema is the only place that turns raw input into a valid Angle.
- Orchestration owns the flow (idle -> loading -> success/error).
- Domain stays pure and deterministic.
- ViewState is consumer-agnostic, so multiple consumers can reuse the same flow.

2) Phase 2 behavior
After Phase 1 success, Phase 2 runs:
- refineIdeas: normalization, drop empty, deterministic dedupe
- rankIdeas: deterministic heuristic score with stable tie-break by id
- selectIdeas: explicit policy (threshold + top N), can return an empty selection

If selection is empty, the pipeline explains why via notes.
There is no forced answer and no hidden randomness.

3) Web consumer
Open the Next.js page and show the same flow rendered in the browser.
Call out the boundary rule: the UI is wiring and rendering only.

AngleLab is not a feature project. It is a structure project:
clean ownership, deterministic behavior, and explicit failure handling.

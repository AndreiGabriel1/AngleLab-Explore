# Phase 2 - Contract and Failure Map (SSOT)

Scope: Phase 2 is a deterministic, rules-only pipeline.
It takes `ctx + ideas` and produces `refined + ranked + selected + notes`.

Phase 2 does not validate the Angle enum and does not change Phase 1 domain meaning.

---

## 1) Input contract (from Phase 1)

### Owned by Phase 2
- `ideas: PipelineIdea[]`
  - Shape: `{ id: string; text: string }`
  - A Phase 2-owned adapter creates `PipelineIdea[]` from Phase 1 domain ideas.
  - Phase 2 does not keep references to Phase 1 objects. It works on adapted copies.

### Provided to Phase 2 (ctx)
- `ctx.angle: string`
  - Definition: Phase 2 treats `ctx.angle` as an opaque string hint for ranking.
  - Source of truth: Angle validation belongs to Phase 1 schema.
  - Assumption in normal flow: Phase 2 runs after Phase 1 success, so `ctx.angle` is typically validated.
  - Rule: Phase 2 must not crash or throw if `ctx.angle` is unexpected.

Optional (design-only):
- A note such as `rank:angle_unvalidated` could be emitted if Phase 2 detects an unknown value.
  - Not required for this version.

### Not owned by Phase 2
- Angle validation (Phase 1 schema owns this)
- Domain meaning and semantics (Phase 1 owns this)

---

## 2) Output contract (always)

### Always returns (no exceptions)
- `refined: PipelineIdea[]`
- `ranked: Array<PipelineIdea & { score: number }>`
- `selected: Array<PipelineIdea & { score: number }>` (may be empty)
- `notes: string[]` (may be empty)

### Invariants (hard rules)
- No crashes on empty or malformed input (`ideas=[]`, `text=""`, unusual characters, etc.).
- If `selected` is empty, `notes` must explain why (at least one note).
- Ranking is deterministic, including a stable tie-break by `id`.
- Phase 2 never mutates Phase 1 domain objects (adapter produces new objects).

---

## 3) Failure map (anti-happy-path)

### 3.1 Refine failures
Refine exists to normalize and remove invalid input (rules-only).

- All ideas removed
  - Output: `refined=[]`
  - Note: `refine:all_removed`

- Duplicates collapsed
  - Behavior: remove duplicates deterministically
  - Policy: stable order, keep first occurrence
  - Note: `refine:dedup:<N>` where `<N>` is the number removed

- Empty or whitespace-only removed
  - Behavior: remove items whose normalized `text` becomes empty
  - Note: `refine:drop_empty:<N>`

Optional (allowed later if needed, not required now):
- `refine:trim`
- `refine:collapse_ws`

### 3.2 Rank failures
Rank exists to compute a deterministic heuristic score and ordering.

- All scores equal
  - Behavior: keep deterministic order using tie-break by `id`
  - Note: `rank:tie`

- Low signal (cannot discriminate)
  - Behavior: still return a deterministic ranked list
  - Note: `rank:low_signal`

### 3.3 Select failures
Select exists to apply an explicit policy without faking confidence.

- None pass threshold
  - Output: `selected=[]`
  - Note: `select:no_decision`

- Fewer than minimum (policy choice)
  - If a fallback policy is used:
    - Output: `selected=[...]`
    - Note: `select:fallback:<details>`
  - If no fallback is used (default):
    - Output: `selected=[]`
    - Note: `select:no_decision`

Default for this codebase:
- Prefer "no decision" over forced answers.

---

## 4) Degradation policy (enterprise-minimal)

### If refine outputs 0 ideas
- `refined=[]`
- `ranked=[]`
- `selected=[]`
- `notes` must include, in order:
  - `refine:all_removed` (or the specific drop reason)
  - `degrade:phase1_only`

Consumer guidance:
- The consumer may render Phase 1 ideas (source list) without claiming a selection.

### If rank is low signal
- Still return deterministic `ranked`
- Include `rank:low_signal`
- Selection still runs normally (often ends in `select:no_decision`)

### If select has no decision
- `selected=[]`
- Include `select:no_decision`
- No implicit "best guess"

---

## 5) Notes policy

### Ownership
- Notes are pipeline-owned, not UI-owned.
- Consumers only render or log notes. They do not invent explanations.

### Format
- `<stage>:<reason>[:details]`
  - Examples:
    - `refine:dedup:2`
    - `refine:drop_empty:1`
    - `rank:tie`
    - `rank:low_signal`
    - `select:no_decision`
    - `degrade:phase1_only`

### Ordering
Notes are appended strictly in this order:
1. refine
2. rank
3. select
4. degrade

### Minimality
Notes should be:
- Stable (no randomness)
- Short
- Sufficient to explain empty selection and major pipeline events

---

## 6) Implementation status

Implemented stages:
1. `refineIdeas`
2. `rankIdeas`
3. `selectIdeas`
4. `runPhase2Pipeline` aggregates notes in order

Tests included:
- Ranking behavior
- Selection behavior

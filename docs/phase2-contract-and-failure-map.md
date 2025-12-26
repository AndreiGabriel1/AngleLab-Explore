# Phase 2 - Contract and Failure Map (SSOT)

Scope: Phase 2 is a deterministic, rules-only pipeline. It receives `ctx + ideas` and returns:
`refined + ranked + selected + notes`.

It does not validate the Phase 1 Angle enum and it does not change Phase 1 domain meaning.

---

## 1) Input Contract (from Phase 1)

### Owned by Phase 2
- `ideas: PipelineIdea[]`
  - shape: `{ id: string; text: string }`
  - a Phase 2-owned adapter converts Phase 1 domain ideas into `PipelineIdea[]`
  - Phase 2 never mutates Phase 1 objects and never keeps references to them

### Provided to Phase 2 (ctx)
- `ctx.angle: string`
  - definition: treated as an opaque string hint for ranking
  - source of truth: Angle validation belongs to the Phase 1 schema layer
  - normal assumption: Phase 2 runs only after Phase 1 success, so `ctx.angle` is usually already validated
  - safety rule: Phase 2 must not throw or crash even if `ctx.angle` is unexpected

Optional (not required in this version):
- if we later detect an unrecognized angle value, we may add `rank:angle_unvalidated`

### Not owned by Phase 2
- Angle enum validation (Phase 1 schema owns this)
- domain semantics (Phase 1 owns meaning and wording of ideas)

---

## 2) Output Contract (always)

### Always returns (no exceptions)
- `refined: PipelineIdea[]`
- `ranked: Array<PipelineIdea & { score: number }>`
- `selected: Array<PipelineIdea & { score: number }>` (may be empty)
- `notes: string[]` (may be empty)

### Invariants (hard rules)
- no crashes on empty input (`ideas=[]`), empty text, weird characters, etc.
- ranking is fully deterministic, including tie-break by `id`
- Phase 2 never mutates Phase 1 objects (adapter creates new objects)
- if `selected` is empty, `notes` must explain why (at least one note)

---

## 3) Failure Map (anti-happy-path)

### 3.1 Refine failures
Refine: normalize + drop invalid + dedupe (rules-only).

- all ideas removed
  - output: `refined=[]`
  - note: `refine:all_removed`

- duplicates collapsed
  - behavior: deterministic dedupe (keep first occurrence in input order)
  - note: `refine:dedup:<N>` where `<N>` is the number removed

- empty/whitespace removed
  - behavior: normalize and drop items whose final text is empty
  - note: `refine:drop_empty:<N>`

Optional (allowed later, but not required):
- `refine:trim`
- `refine:collapse_ws`

### 3.2 Rank failures
Rank: deterministic heuristic score + deterministic ordering.

- all scores equal
  - behavior: deterministic order via tie-break by `id`
  - note: `rank:tie`

- cannot discriminate (low signal)
  - behavior: still return ranked list deterministically
  - note: `rank:low_signal`

### 3.3 Select failures
Select: apply an explicit policy (threshold + topN) without fake confidence.

- none pass threshold
  - output: `selected=[]`
  - note: `select:no_decision`

- fewer than minimum
  - if we ever choose a fallback policy:
    - output: `selected=[...]`
    - note: `select:fallback:<details>`
  - default for this project: no fallback
    - output: `selected=[]`
    - note: `select:no_decision`

---

## 4) Degradation Policy (enterprise-minimal)

### If refine outputs 0 ideas
Return:
- `refined=[]`
- `ranked=[]`
- `selected=[]`
- `notes` must include (in order):
  - the refine note (`refine:all_removed` or equivalent)
  - `degrade:phase1_only`

Consumer guidance:
- the UI/CLI can render Phase 1 output (source list) without "smart selection"

### If rank is low signal
- still return deterministic `ranked`
- include `rank:low_signal`
- selection still runs the normal policy (likely ends in `select:no_decision`)

### If select returns no decision
- `selected=[]`
- include `select:no_decision`
- no implicit "best guess"

---

## 5) Notes Policy

### Ownership
- notes are pipeline-owned
- consumers render or log notes, but never invent explanations

### Format
- `<stage>:<reason>[:details]`
  - examples:
    - `refine:dedup:2`
    - `refine:drop_empty:1`
    - `rank:tie`
    - `rank:low_signal`
    - `select:no_decision`
    - `degrade:phase1_only`

### Ordering
Notes are appended strictly in this order:
1) refine
2) rank
3) select
4) degrade

### Minimality
Notes should be:
- stable (no randomness)
- short
- enough to explain empty selection and major pipeline events
- not verbose prose

---

## 6) Implementation order (implemented)

1) `refineIdeas` (normalize, drop empty, dedupe, notes)
2) `rankIdeas` (deterministic heuristic + tie-break + low-signal detection + notes)
3) `selectIdeas` (threshold + topN, empty => note; fallback intentionally not used)
4) `runPhase2Pipeline` aggregates notes in strict order and applies degradation policy
5) minimal tests to cover key behavior

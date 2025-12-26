# Phase 2 — Contract & Failure Map (SSOT)

Scope: Phase 2 este un pipeline determinist (rules-only), care primește `ctx + ideas` și produce `refined + ranked + selected + notes`.
Nu validează Angle enum și nu schimbă meaning-ul din Phase 1.

---

## 1) Input Contract (from Phase 1)

### Owned by Phase 2
- `ideas: PipelineIdea[]`
  - shape: `{ id: string; text: string }`
  - `adapter` (Phase 2-owned) creează `PipelineIdea[]` din Domain Ideas (Phase 1).
  - Phase 2 nu mută / nu păstrează referințe către obiectele din Phase 1.

### Provided to Phase 2 (ctx)
- `ctx.angle: string`
  - **Definition:** Phase 2 tratează `ctx.angle` ca **string opac** (un “hint” pentru ranking).
  - **Source-of-truth:** validarea angle-ului (enum/union) aparține **Phase 1 schema**.
  - **Assumption in normal flow:** Phase 2 este apelat doar după success în Phase 1 → `ctx.angle` e “validated-by-Phase1”, dar Phase 2 nu se bazează pe asta (nu aruncă / nu crash-uiește dacă e value ciudat).
  - **Optional note (dacă ajunge raw/unknown):** `rank:angle_unvalidated` (doar dacă detectăm că nu e unul dintre valorile cunoscute; nu obligatoriu acum).

### Not owned by Phase 2
- Validarea Angle enum (Phase 1 schema owns)
- Domain meaning (`title/description/angle` semantics) (Phase 1 owns)

---

## 2) Output Contract (always)

### Always returns (no exceptions)
- `refined: PipelineIdea[]`
- `ranked: Array<PipelineIdea & { score: number }>`
- `selected: Array<PipelineIdea & { score: number }>` *(may be empty)*
- `notes: string[]` *(may be empty)*

### Invariants (hard rules)
- **No crashes** on empty input (`ideas=[]`, `text=""`, weird chars, etc.).
- **If `selected` is empty → `notes` MUST explain WHY** (minimum 1 note).
- **Ranking is deterministic**, including tie-break by `id`.
- **Phase 2 never mutates Phase 1 domain objects** (adapter creates new objects).

---

## 3) Failure Map (Anti-Happy-Path)

### 3.1 Refine failures
Refine’s job: normalize + drop invalid + dedupe (rules-only).

- **All ideas removed**
  - output: `refined=[]`
  - note: `refine:all_removed`

- **Duplicates collapsed**
  - behavior: collapse duplicates deterministically (stable order, keep first by input order; ties resolved by id only if needed)
  - note: `refine:dedup:<N>` where `<N>` = number removed

- **Empty/whitespace removed**
  - behavior: remove items whose normalized `text` is empty
  - note: `refine:drop_empty:<N>`

*(Optional, allowed later without scope creep: `refine:trim`, `refine:collapse_ws` only if we want visibility.)*

### 3.2 Rank failures
Rank’s job: compute deterministic heuristic score + ordering.

- **All scores equal**
  - behavior: keep deterministic order via tie-break by `id`
  - note: `rank:tie`

- **Cannot discriminate (low signal)**
  - behavior: still produce ranked deterministic list
  - note: `rank:low_signal`

### 3.3 Select failures
Select’s job: apply a selection policy (threshold + topN) without fake confidence.

- **None pass threshold**
  - output: `selected=[]`
  - note: `select:no_decision`

- **Fewer than minimum**
  - If we choose fallback list:
    - output: `selected=[...]` (explicit fallback policy)
    - note: `select:fallback:<details>`
  - If we do NOT choose fallback:
    - output: `selected=[]`
    - note: `select:no_decision`

*(SSOT default for “enterprise minimal”: prefer **no fake confidence** → empty + note.)*

---

## 4) Degradation Policy (Enterprise Minimal)

### If refine outputs 0 ideas
- `refined=[]`
- `ranked=[]`
- `selected=[]`
- `notes` MUST include (in order):
  - `refine:all_removed` *(or drop reason)*
  - `degrade:phase1_only`

**Consumer guidance:** UI/CLI poate afișa ideile din Phase 1 (source list) fără “smart selection”.

### If rank low signal
- still return deterministic `ranked`
- include note: `rank:low_signal`
- selection still applies policy normally (but likely ends in `select:no_decision`)

### If select no decision
- `selected=[]`
- include note: `select:no_decision`
- **no “best guess”** implicit

---

## 5) Notes Policy

### Ownership
- Notes sunt **pipeline-owned**, nu UI-owned.
- UI/CLI doar afișează / loghează; nu inventează explicații.

### Format
- `"<stage>:<reason>[:details]"`
  - examples:
    - `refine:dedup:2`
    - `refine:drop_empty:1`
    - `rank:tie`
    - `rank:low_signal`
    - `select:no_decision`
    - `degrade:phase1_only`

### Ordering
- Notes are appended strictly in this order:
  1) refine
  2) rank
  3) select
  4) degrade

### Minimality rule
- Notes should be:
  - stable (no randomness)
  - short
  - enough to explain “empty selected” and major pipeline events
  - no verbose prose

---

## 6) Implementation order -- //IMPLEMENTED. 

1) Implement `refineIdeas` (normalize, drop empty, dedupe, notes)
2) Implement `rankIdeas` (deterministic heuristic + tie-break + low-signal detection + notes)
3) Implement `selectIdeas` (threshold + topN, empty => note; optional fallback decision)
4) Ensure orchestration aggregates notes in strict order
5) Add 1 happy path + 1 failure path verification (manual run or minimal tests later)

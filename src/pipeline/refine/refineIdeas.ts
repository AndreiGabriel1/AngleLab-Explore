// src/pipeline/refine/refineIdeas.ts
import { Idea, PipelineContext, RefineResult } from "../types";

function normalizeText(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function refineIdeas(ctx: PipelineContext, ideas: Idea[]): RefineResult {
  void ctx; // ctx not used in refine (yet)

  const notes: string[] = [];

  let droppedEmpty = 0;
  const normalized: Idea[] = [];

  for (const idea of ideas) {
    const text = normalizeText(idea.text ?? "");
    if (text.length === 0) {
      droppedEmpty++;
      continue;
    }
    normalized.push({ ...idea, text }); // new object (no mutation)
  }

  if (droppedEmpty > 0) notes.push(`refine:drop_empty:${droppedEmpty}`);

  // Dedupe by normalized text (keep first occurrence, deterministic)
  const seen = new Set<string>();
  const refined: Idea[] = [];
  let deduped = 0;

  for (const idea of normalized) {
    const key = idea.text;
    if (seen.has(key)) {
      deduped++;
      continue;
    }
    seen.add(key);
    refined.push(idea);
  }

  if (deduped > 0) notes.push(`refine:dedup:${deduped}`);

  if (refined.length === 0) {
    notes.push("refine:all_removed");
  }

  return { ideas: refined, notes };
}

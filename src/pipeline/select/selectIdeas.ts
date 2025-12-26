import { Idea, PipelineContext, SelectResult } from "../types";

export function selectIdeas(
  ctx: PipelineContext,
  ideas: (Idea & { score: number })[]
): SelectResult {
  void ctx;

  const notes: string[] = [];

  const TOP_N = 5;
  const THRESHOLD = 1;

  const passing = ideas.filter((i) => i.score >= THRESHOLD);
  const selected = passing.slice(0, TOP_N);

  if(selected.length === 0) {
    notes.push("select:no_decision");

    }

    return { selected, notes };
}


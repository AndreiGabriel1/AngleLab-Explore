import { describe, expect, it } from "vitest";
import { selectIdeas } from "../select/selectIdeas";
import type { PipelineContext, Idea } from "../types";

describe("selectIdeas", () => {
  it("none pass threshold => selected=[] + note select:no_decision", () => {
    const ctx: PipelineContext = { angle: "Time_Saving" };

    const ranked: (Idea & { score: number })[] = [
      { id: "a", text: "idea a", score: 0 },
      { id: "b", text: "idea b", score: 0 },
    ];

    const out = selectIdeas(ctx, ranked);

    expect(out.selected).toEqual([]);
    expect(out.notes ?? []).toContain("select:no_decision");
  });
});

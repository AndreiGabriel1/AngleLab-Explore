import { describe, expect, it } from "vitest";
import { rankIdeas } from "../rank/rankIdeas";
import type { PipelineContext, Idea } from "../types";

describe("rankIdeas", () => {
  it("tie-break deterministic by id + emits tie/low_signal on all-zero scores", () => {
    const ctx: PipelineContext = { angle: "Time_Saving" };

    const ideas: Idea[] = [
      { id: "b", text: "random text" },
      { id: "a", text: "random text" },
    ];

    const out = rankIdeas(ctx, ideas);

    expect(out.ideas.map((i) => i.id)).toEqual(["a", "b"]);
    expect(out.notes ?? []).toContain("rank:tie");
    expect(out.notes ?? []).toContain("rank:low_signal");
  });
});

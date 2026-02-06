import { describe, expect, it } from "vitest";
import { runPhase2Pipeline } from "../../orchestration/phase2orchestration";
import type { PipelineContext, Idea } from "../types";

describe("Phase 2 Pipeline integration", () => {
  const ctx: PipelineContext = { angle: "Time_Saving" };

  it("degrades to phase1_only when all refined ideas removed", () => {
    const ideas: Idea[] = [
      { id: "1", text: "" },
      { id: "2", text: "   " },
    ];

    const result = runPhase2Pipeline(ctx, ideas);

    expect(result.refined).toEqual([]);
    expect(result.ranked).toEqual([]);
    expect(result.selected).toEqual([]);
    expect(result.notes).toContain("refine:all_removed");
    expect(result.notes).toContain("degrade:phase1_only");
  });

  it("produces select:no_decision when all scores below threshold", () => {
    const ideas: Idea[] = [
      { id: "1", text: "no match keywords" },
      { id: "2", text: "random text" },
    ];

    const result = runPhase2Pipeline(ctx, ideas);

    expect(result.selected).toEqual([]);
    expect(result.notes).toContain("select:no_decision");
  });

 it("emits rank:tie when all scores equal", () => {
  const ideas: Idea[] = [
    { id: "c", text: "nothing relevant here" },
    { id: "a", text: "random words only" },
    { id: "b", text: "unrelated content" },
  ];

  const result = runPhase2Pipeline(ctx, ideas);

  expect(result.notes).toContain("rank:tie");
  expect(result.notes).toContain("rank:low_signal");
  expect(result.ranked.map(i => i.id)).toEqual(["a", "b", "c"]);
});

  it("selects ideas above threshold", () => {
    const ideas: Idea[] = [
      { id: "1", text: "time saving efficiency" },
      { id: "2", text: "no match" },
    ];

    const result = runPhase2Pipeline(ctx, ideas);

    expect(result.selected.length).toBeGreaterThan(0);
    expect(result.selected[0].score).toBeGreaterThan(0);
  });

  it("maintains notes order: refine -> rank -> select", () => {
    const ideas: Idea[] = [
      { id: "1", text: "duplicate" },
      { id: "2", text: "duplicate" },
      { id: "3", text: "no match" },
    ];

    const result = runPhase2Pipeline(ctx, ideas);

    const refineIndex = result.notes.findIndex(n => n.startsWith("refine:"));
    const rankIndex = result.notes.findIndex(n => n.startsWith("rank:"));
    const selectIndex = result.notes.findIndex(n => n.startsWith("select:"));

    if (refineIndex !== -1 && rankIndex !== -1) {
      expect(refineIndex).toBeLessThan(rankIndex);
    }
    if (rankIndex !== -1 && selectIndex !== -1) {
      expect(rankIndex).toBeLessThan(selectIndex);
    }
  });
});
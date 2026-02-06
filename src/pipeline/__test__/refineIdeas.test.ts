import { describe, expect, it } from "vitest";
import { refineIdeas } from "../refine/refineIdeas"; 
import type { Idea, PipelineContext } from "../types";

describe("refineIdeas", () => {
  const ctx: PipelineContext = { angle: "Time_Saving" };

  it("removes empty text ideas", () => {
    const ideas: Idea[] = [
      { id: "1", text: "Valid idea" },
      { id: "2", text: "   " },
      { id: "3", text: "" },
    ];

    const result = refineIdeas(ctx, ideas);

    expect(result.ideas).toHaveLength(1);
    expect(result.ideas[0].text).toBe("Valid idea");
    expect(result.notes).toContain("refine:drop_empty:2");
  });

  it("deduplicates normalized text", () => {
    const ideas: Idea[] = [
      { id: "1", text: "  Idea A  " },
      { id: "2", text: "idea a" },
      { id: "3", text: "Idea B" },
    ];

    const result = refineIdeas(ctx, ideas);

    expect(result.ideas).toHaveLength(2);
    expect(result.ideas[0].text).toBe("Idea A");
    expect(result.ideas[1].text).toBe("Idea B");
    expect(result.notes).toContain("refine:dedup:1");
  });

  it("normalizes whitespace", () => {
    const ideas: Idea[] = [
      { id: "1", text: "Multiple    spaces   here" },
    ];

    const result = refineIdeas(ctx, ideas);

    expect(result.ideas[0].text).toBe("Multiple spaces here");
  });

  it("emits refine:all_removed when all ideas dropped", () => {
    const ideas: Idea[] = [
      { id: "1", text: "" },
      { id: "2", text: "   " },
    ];

    const result = refineIdeas(ctx, ideas);

    expect(result.ideas).toEqual([]);
    expect(result.notes).toContain("refine:all_removed");
  });

  it("keeps first occurrence on duplicate", () => {
    const ideas: Idea[] = [
      { id: "first", text: "duplicate" },
      { id: "second", text: "duplicate" },
    ];

    const result = refineIdeas(ctx, ideas);

    expect(result.ideas).toHaveLength(1);
    expect(result.ideas[0].id).toBe("first");
  });
});
import { describe, expect, it } from "vitest";
import { loadIdeasForAngle } from "../orchestrator"; // relative path UP

describe("loadIdeasForAngle orchestration", () => {
  it("returns error state for invalid input", async () => {
    const result = await loadIdeasForAngle("BadAngle");
    
    expect(result.status).toBe("error");
    expect(result.errorMessage).toContain("Unsupported angle");
    expect(result.angle).toBeNull();
    expect(result.ideas).toEqual([]);
  });

  it("returns success state for valid Time_Saving", async () => {
    const result = await loadIdeasForAngle("Time_Saving");
    
    expect(result.status).toBe("success");
    expect(result.angle).toBe("Time_Saving");
    expect(result.ideas.length).toBeGreaterThan(0);
    expect(result.errorMessage).toBeNull();
  });

  it("returns success state for valid Money_Saving", async () => {
    const result = await loadIdeasForAngle("Money_Saving");
    
    expect(result.status).toBe("success");
    expect(result.angle).toBe("Money_Saving");
    expect(result.ideas.length).toBeGreaterThan(0);
  });

  it("generates deterministic ideas for same angle", async () => {
    const result1 = await loadIdeasForAngle("Growth");
    const result2 = await loadIdeasForAngle("Growth");
    
    expect(result1.ideas).toEqual(result2.ideas);
  });
});
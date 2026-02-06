import { describe, expect, it } from "vitest";
import { parseAngle } from "../schema/angleSchema"; 
describe("parseAngle validation", () => {
  it("accepts valid angles", () => {
    const result = parseAngle("Time_Saving");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("Time_Saving");
    }
  });

  it("rejects invalid string", () => {
    const result = parseAngle("Invalid_Angle");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Unsupported angle");
    }
  });

  it("rejects non-string types", () => {
    expect(parseAngle(123).ok).toBe(false);
    expect(parseAngle(null).ok).toBe(false);
    expect(parseAngle(undefined).ok).toBe(false);
  });

  it("accepts all valid angle types", () => {
    expect(parseAngle("Time_Saving").ok).toBe(true);
    expect(parseAngle("Money_Saving").ok).toBe(true);
    expect(parseAngle("Growth").ok).toBe(true);
    expect(parseAngle("Risk_Reduction").ok).toBe(true);
  });
});
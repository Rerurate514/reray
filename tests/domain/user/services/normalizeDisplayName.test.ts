import { describe, expect, it } from "vitest";
import { normalizeDisplayName } from "../../../../app/domain/user/services/normalizeDisplayName";

describe("normalizeDisplayName", () => {
  it("trims and collapses internal whitespace", () => {
    expect(normalizeDisplayName("  Alice   Smith  ")).toBe("Alice Smith");
  });

  it("rejects a blank display name", () => {
    expect(() => normalizeDisplayName("   ")).toThrow(
      "Display name is required",
    );
  });

  it("accepts a display name of exactly 40 characters", () => {
    expect(normalizeDisplayName("a".repeat(40))).toBe("a".repeat(40));
  });

  it("rejects a display name longer than 40 characters", () => {
    expect(() => normalizeDisplayName("a".repeat(41))).toThrow(
      "Display name must be 40 characters or fewer",
    );
  });
});

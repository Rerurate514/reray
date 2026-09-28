import { describe, expect, it } from "vitest";
import { normalizeCalendarDescription } from "../../../../app/domain/calendar/services/normalizeCalendarDescription";
import { UserFacingError } from "../../../../app/domain/shared/errors/userFacingError";

describe("normalizeCalendarDescription", () => {
  it("returns null for undefined or blank input", () => {
    expect(normalizeCalendarDescription(undefined)).toBe(null);
    expect(normalizeCalendarDescription("   ")).toBe(null);
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeCalendarDescription("  hello  ")).toBe("hello");
  });

  it("accepts a description of exactly 2000 characters", () => {
    expect(normalizeCalendarDescription("a".repeat(2000))).toBe(
      "a".repeat(2000),
    );
  });

  it("rejects a description longer than 2000 characters", () => {
    expect(() => normalizeCalendarDescription("a".repeat(2001))).toThrow(
      UserFacingError,
    );
    expect(() => normalizeCalendarDescription("a".repeat(2001))).toThrow(
      "Description must be 2000 characters or fewer",
    );
  });
});

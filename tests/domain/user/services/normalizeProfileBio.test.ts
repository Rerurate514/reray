import { describe, expect, it } from "vitest";
import { UserFacingError } from "../../../../app/domain/shared/errors/userFacingError";
import { normalizeProfileBio } from "../../../../app/domain/user/services/normalizeProfileBio";

describe("normalizeProfileBio", () => {
  it("returns null for undefined or blank input", () => {
    expect(normalizeProfileBio(undefined)).toBe(null);
    expect(normalizeProfileBio("   ")).toBe(null);
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeProfileBio("  hello  ")).toBe("hello");
  });

  it("accepts exactly 200 characters", () => {
    expect(normalizeProfileBio("a".repeat(200))).toBe("a".repeat(200));
  });

  it("rejects more than 200 characters", () => {
    expect(() => normalizeProfileBio("a".repeat(201))).toThrow(UserFacingError);
    expect(() => normalizeProfileBio("a".repeat(201))).toThrow(
      "Bio must be 200 characters or fewer",
    );
  });
});

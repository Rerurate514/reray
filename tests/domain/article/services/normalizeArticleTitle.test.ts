import { describe, expect, it } from "vitest";
import { normalizeArticleTitle } from "../../../../app/domain/article/services/normalizeArticleTitle";

describe("normalizeArticleTitle", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeArticleTitle("  My article  ")).toBe("My article");
  });

  it("accepts a title of exactly 160 characters", () => {
    expect(normalizeArticleTitle("a".repeat(160))).toBe("a".repeat(160));
  });

  it("rejects blank and over-long titles", () => {
    expect(() => normalizeArticleTitle("   ")).toThrow(
      "Article title is required",
    );
    expect(() => normalizeArticleTitle("a".repeat(161))).toThrow(
      "Article title is required",
    );
  });
});

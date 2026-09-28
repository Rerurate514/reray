import { describe, expect, it } from "vitest";
import { normalizeCalendarVisibility } from "../../../../app/domain/calendar/services/normalizeCalendarVisibility";

describe("normalizeCalendarVisibility", () => {
  it("keeps private visibility", () => {
    expect(normalizeCalendarVisibility("private")).toBe("private");
  });

  it("treats public and any unknown value as public", () => {
    expect(normalizeCalendarVisibility("public")).toBe("public");
    expect(normalizeCalendarVisibility("something-else")).toBe("public");
    expect(normalizeCalendarVisibility(undefined)).toBe("public");
  });
});

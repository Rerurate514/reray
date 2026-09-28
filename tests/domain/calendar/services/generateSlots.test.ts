import { describe, expect, it } from "vitest";
import { generateSlots } from "../../../../app/domain/calendar/services/generateSlots";
import { UserFacingError } from "../../../../app/domain/shared/errors/userFacingError";

describe("generateSlots", () => {
  it("generates every day for daily frequency", () => {
    expect(generateSlots("2026-01-01", "2026-01-03", "daily")).toEqual([
      { scheduledDate: "2026-01-01", position: 1 },
      { scheduledDate: "2026-01-02", position: 2 },
      { scheduledDate: "2026-01-03", position: 3 },
    ]);
  });

  it("skips weekends for weekdays frequency", () => {
    expect(generateSlots("2026-01-01", "2026-01-04", "weekdays")).toEqual([
      { scheduledDate: "2026-01-01", position: 1 },
      { scheduledDate: "2026-01-02", position: 2 },
    ]);
  });

  it("rejects malformed or reversed date ranges", () => {
    expect(() => generateSlots("2026/01/01", "2026-01-03", "daily")).toThrow(
      "Invalid date range",
    );
    expect(() => generateSlots("2026-01-03", "2026-01-01", "daily")).toThrow(
      UserFacingError,
    );
  });

  it("rejects a range that contains no weekday slots", () => {
    expect(() => generateSlots("2026-01-03", "2026-01-04", "weekdays")).toThrow(
      "No slots generated",
    );
  });

  it("accepts exactly 366 daily slots", () => {
    expect(generateSlots("2026-01-01", "2027-01-01", "daily")).toHaveLength(
      366,
    );
  });

  it("rejects more than 366 daily slots", () => {
    expect(() => generateSlots("2026-01-01", "2027-01-02", "daily")).toThrow(
      "Too many slots: maximum is 366",
    );
  });
});

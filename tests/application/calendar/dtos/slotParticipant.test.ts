import { describe, expect, it } from "vitest";
import type { SlotParticipant } from "../../../../app/application/calendar/dtos/slotParticipant";
import {
  countActiveParticipants,
  isActiveParticipant,
} from "../../../../app/application/calendar/dtos/slotParticipant";

function createParticipant(userId: string | null): SlotParticipant {
  return {
    entryId: `entry-${userId ?? "withdrawn"}`,
    userId,
    username: userId,
    displayName: userId,
    avatarUrl: null,
    description: null,
    articleTitle: null,
    articleUrl: null,
  };
}

describe("isActiveParticipant", () => {
  it("is true when the entry still belongs to a user", () => {
    expect(isActiveParticipant(createParticipant("user-1"))).toBe(true);
  });

  it("is false for an entry left by a deleted user", () => {
    expect(isActiveParticipant(createParticipant(null))).toBe(false);
  });
});

describe("countActiveParticipants", () => {
  it("counts only entries that still belong to a user", () => {
    expect(
      countActiveParticipants([
        createParticipant("user-1"),
        createParticipant(null),
        createParticipant("user-2"),
      ]),
    ).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(countActiveParticipants([])).toBe(0);
  });
});

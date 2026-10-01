import { describe, expect, it } from "vitest";
import {
  buildRelayProgress,
  type RelayProgressSlot,
} from "../../../../app/application/calendar/services/buildRelayProgress";

function createParticipant(
  userId: string | null,
  articleUrl: string | null,
): RelayProgressSlot["participants"][number] {
  return { userId, articleUrl };
}

function createSlot(
  participants: RelayProgressSlot["participants"] = [],
): RelayProgressSlot {
  return { participants };
}

describe("buildRelayProgress", () => {
  it("counts article, filled and empty slots separately", () => {
    const progress = buildRelayProgress([
      createSlot([createParticipant("user-1", "https://example.com/1")]),
      createSlot([createParticipant("user-2", null)]),
      createSlot(),
      createSlot([createParticipant(null, null)]),
    ]);

    expect(progress).toEqual({
      totalSlots: 4,
      articleSlots: 1,
      filledSlots: 2,
      emptySlots: 2,
    });
  });

  it("counts an article left by a withdrawn participant", () => {
    const progress = buildRelayProgress([
      createSlot([createParticipant(null, "https://example.com/1")]),
    ]);

    expect(progress).toEqual({
      totalSlots: 1,
      articleSlots: 1,
      filledSlots: 0,
      emptySlots: 1,
    });
  });

  it("counts a slot once even when several participants have articles", () => {
    const progress = buildRelayProgress([
      createSlot([
        createParticipant("user-1", "https://example.com/1"),
        createParticipant("user-2", "https://example.com/2"),
      ]),
    ]);

    expect(progress).toEqual({
      totalSlots: 1,
      articleSlots: 1,
      filledSlots: 1,
      emptySlots: 0,
    });
  });

  it("returns zero counts for a calendar without slots", () => {
    expect(buildRelayProgress([])).toEqual({
      totalSlots: 0,
      articleSlots: 0,
      filledSlots: 0,
      emptySlots: 0,
    });
  });
});

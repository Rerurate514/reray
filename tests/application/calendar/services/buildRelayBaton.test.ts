import { describe, expect, it } from "vitest";
import type { RelayBatonLink } from "../../../../app/application/calendar/dtos/relayBaton";
import {
  buildRelayBaton,
  buildRelayBatons,
  type RelayBatonSlot,
} from "../../../../app/application/calendar/services/buildRelayBaton";

function createLink(
  position: number,
  overrides: Partial<RelayBatonLink> = {},
): RelayBatonLink {
  return {
    slotId: `slot-${position}`,
    position,
    scheduledDate: null,
    articleTitle: `Article ${position}`,
    articleUrl: `https://example.com/${position}`,
    author: {
      username: `user${position}`,
      displayName: `User ${position}`,
      avatarUrl: null,
    },
    ...overrides,
  };
}

describe("buildRelayBaton", () => {
  it("picks the nearest previous and next articles", () => {
    const baton = buildRelayBaton(
      [createLink(1), createLink(2), createLink(4), createLink(5)],
      3,
    );

    expect(baton.previous?.position).toBe(2);
    expect(baton.next?.position).toBe(4);
  });

  it("skips positions without a registered article", () => {
    const baton = buildRelayBaton([createLink(1), createLink(7)], 4);

    expect(baton.previous?.position).toBe(1);
    expect(baton.next?.position).toBe(7);
  });

  it("returns null when there is no article on one side", () => {
    expect(buildRelayBaton([createLink(3)], 3)).toEqual({
      previous: null,
      next: null,
    });
    expect(buildRelayBaton([createLink(1)], 3).next).toBeNull();
    expect(buildRelayBaton([createLink(5)], 3).previous).toBeNull();
  });

  it("keeps the first entry when a position has multiple articles", () => {
    const first = createLink(1, { articleUrl: "https://example.com/first" });
    const second = createLink(1, { articleUrl: "https://example.com/second" });

    expect(buildRelayBaton([first, second, createLink(4)], 3).previous).toBe(
      first,
    );
    expect(buildRelayBaton([createLink(0), first, second], 0).next).toBe(first);
  });
});

function createSlot(
  position: number,
  participants: RelayBatonSlot["participants"] = [],
): RelayBatonSlot {
  return {
    id: `slot-${position}`,
    position,
    scheduledDate: null,
    participants,
  };
}

function createParticipant(
  url: string | null,
): RelayBatonSlot["participants"][number] {
  return {
    username: "alice",
    displayName: "Alice",
    avatarUrl: null,
    articleTitle: url ? `Article ${url}` : null,
    articleUrl: url,
  };
}

describe("buildRelayBatons", () => {
  it("builds a baton for every slot, skipping slots without an article", () => {
    const batons = buildRelayBatons([
      createSlot(1, [createParticipant("https://example.com/1")]),
      createSlot(2, [createParticipant(null)]),
      createSlot(3, [createParticipant("https://example.com/3")]),
    ]);

    expect(batons.get("slot-1")?.previous).toBeNull();
    expect(batons.get("slot-1")?.next?.slotId).toBe("slot-3");
    expect(batons.get("slot-2")?.previous?.slotId).toBe("slot-1");
    expect(batons.get("slot-2")?.next?.slotId).toBe("slot-3");
    expect(batons.get("slot-3")?.next).toBeNull();
  });

  it("returns an empty baton for a calendar without articles", () => {
    const batons = buildRelayBatons([
      createSlot(1, [createParticipant(null)]),
      createSlot(2),
    ]);

    expect(batons.get("slot-1")).toEqual({ previous: null, next: null });
    expect(batons.get("slot-2")).toEqual({ previous: null, next: null });
  });
});

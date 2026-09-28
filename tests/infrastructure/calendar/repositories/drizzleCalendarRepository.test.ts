import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { createDrizzleCalendarRepository } from "../../../../app/infrastructure/calendar/repositories/drizzleCalendarRepository";
import { createDb } from "../../../../app/infrastructure/providers/db/client";
import {
  calendars,
  calendarTags,
  slotEntries,
  slots,
  tags,
  users,
} from "../../../../app/infrastructure/providers/db/schema";

const now = 1_700_000_000_000;
const db = createDb(env.DB);
const repository = createDrizzleCalendarRepository(db);

beforeEach(async () => {
  await db.delete(slotEntries);
  await db.delete(slots);
  await db.delete(calendarTags);
  await db.delete(calendars);
  await db.delete(tags);
  await db.delete(users);
});

async function insertUser(id: string) {
  await db.insert(users).values({
    id,
    firebaseUid: `firebase-${id}`,
    username: id,
    displayName: id,
    avatarUrl: null,
    bio: null,
    createdAt: now,
    updatedAt: now,
  });
}

async function insertCalendar(input: {
  id: string;
  ownerId: string;
  capacity: number;
  slotIds: string[];
}) {
  await repository.createWithSlots(
    {
      id: input.id,
      ownerId: input.ownerId,
      slug: input.id,
      title: input.id,
      description: null,
      startDate: "2026-01-01",
      endDate: "2026-01-01",
      visibility: "public",
      capacity: input.capacity,
      createdAt: now,
      updatedAt: now,
    },
    input.slotIds.map((slotId, index) => ({
      id: slotId,
      calendarId: input.id,
      scheduledDate: null,
      position: index + 1,
      createdAt: now,
      updatedAt: now,
    })),
    [],
  );
}

async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

describe("joinSlot", () => {
  it("returns slotNotFound for an unknown slot", async () => {
    await insertUser("alice");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 1,
      slotIds: ["slot-1"],
    });

    const outcome = await repository.joinSlot({
      entryId: "entry-1",
      slotId: "missing",
      userId: "alice",
      now,
    });

    expect(outcome).toBe("slotNotFound");
  });

  it("joins a slot and reports alreadyJoined when repeated", async () => {
    await insertUser("alice");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 1,
      slotIds: ["slot-1"],
    });

    expect(
      await repository.joinSlot({
        entryId: "entry-1",
        slotId: "slot-1",
        userId: "alice",
        now,
      }),
    ).toBe("joined");

    expect(
      await repository.joinSlot({
        entryId: "entry-2",
        slotId: "slot-1",
        userId: "alice",
        now,
      }),
    ).toBe("alreadyJoined");
  });

  it("reports full once the capacity is reached", async () => {
    await insertUser("alice");
    await insertUser("bob");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 1,
      slotIds: ["slot-1"],
    });

    expect(
      await repository.joinSlot({
        entryId: "entry-1",
        slotId: "slot-1",
        userId: "alice",
        now,
      }),
    ).toBe("joined");

    expect(
      await repository.joinSlot({
        entryId: "entry-2",
        slotId: "slot-1",
        userId: "bob",
        now,
      }),
    ).toBe("full");
  });

  it("fills a slot up to the configured capacity", async () => {
    await insertUser("alice");
    await insertUser("bob");
    await insertUser("carol");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 2,
      slotIds: ["slot-1"],
    });

    expect(
      await repository.joinSlot({
        entryId: "entry-1",
        slotId: "slot-1",
        userId: "alice",
        now,
      }),
    ).toBe("joined");
    expect(
      await repository.joinSlot({
        entryId: "entry-2",
        slotId: "slot-1",
        userId: "bob",
        now,
      }),
    ).toBe("joined");
    expect(
      await repository.joinSlot({
        entryId: "entry-3",
        slotId: "slot-1",
        userId: "carol",
        now,
      }),
    ).toBe("full");
  });
});

describe("cancelSlot", () => {
  it("removes the joining user's entry", async () => {
    await insertUser("alice");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 1,
      slotIds: ["slot-1"],
    });
    await repository.joinSlot({
      entryId: "entry-1",
      slotId: "slot-1",
      userId: "alice",
      now,
    });

    expect(
      await repository.cancelSlot({ slotId: "slot-1", userId: "alice", now }),
    ).toBe(true);

    const detail = await repository.findSlotDetail("cal", "slot-1");
    expect(detail?.slot.participants).toHaveLength(0);
  });
});

describe("withdrawn participants", () => {
  it("keeps the entry but frees capacity when the user is deleted", async () => {
    await insertUser("alice");
    await insertUser("bob");
    await insertCalendar({
      id: "cal",
      ownerId: "alice",
      capacity: 1,
      slotIds: ["slot-1"],
    });
    await repository.joinSlot({
      entryId: "entry-1",
      slotId: "slot-1",
      userId: "alice",
      now,
    });

    await deleteUser("alice");

    const detail = await repository.findSlotDetail("cal", "slot-1");
    expect(detail?.slot.participants).toHaveLength(1);
    expect(detail?.slot.participants[0]?.userId).toBeNull();
    expect(await repository.findMaxActiveParticipantCount("cal")).toBe(0);

    expect(
      await repository.joinSlot({
        entryId: "entry-2",
        slotId: "slot-1",
        userId: "bob",
        now,
      }),
    ).toBe("joined");
  });
});

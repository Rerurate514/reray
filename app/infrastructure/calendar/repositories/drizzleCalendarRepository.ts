import { and, asc, eq, gt, lt, lte, gte, sql } from 'drizzle-orm'
import type { CalendarRepository } from '../../../application/calendar/repositories/calendarRepository'
import type { SlotParticipant } from '../../../application/calendar/dtos/slotParticipant'
import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'
import type { Db } from '../../providers/db/client'
import { calendars, calendarTags, slotEntries, slots, tags } from '../../providers/db/schema'
import { attachTagsToCalendar, listTagsByCalendarIds, replaceCalendarTags } from './calendarTagQueries'

type SlotEntryRecord = {
  id: string
  userId: string | null
  description: string | null
  articleTitle: string | null
  articleUrl: string | null
  user: {
    username: string
    displayName: string
    avatarUrl: string | null
  } | null
}

function toParticipant(entry: SlotEntryRecord): SlotParticipant {
  return {
    entryId: entry.id,
    userId: entry.userId,
    username: entry.user?.username ?? null,
    displayName: entry.user?.displayName ?? null,
    avatarUrl: entry.user?.avatarUrl ?? null,
    description: entry.description,
    articleTitle: entry.articleTitle,
    articleUrl: entry.articleUrl,
  }
}

export function createDrizzleCalendarRepository(db: Db): CalendarRepository {
  return {
    async createWithSlots(calendar: NewCalendar, slotRows: NewSlot[], tagNames: string[]) {
      await db.insert(calendars).values(calendar)
      for (let index = 0; index < slotRows.length; index += 10) {
        await db.insert(slots).values(slotRows.slice(index, index + 10))
      }

      await attachTagsToCalendar(db, calendar.id, tagNames, calendar.createdAt)
    },

    async findDetailBySlug(slug) {
      const calendar = await db.query.calendars.findFirst({
        where: eq(calendars.slug, slug),
        with: {
          owner: true,
        },
      })

      if (!calendar) {
        return null
      }

      const slotRows = await db.query.slots.findMany({
        where: eq(slots.calendarId, calendar.id),
        orderBy: asc(slots.position),
        with: {
          entries: {
            orderBy: asc(slotEntries.createdAt),
            with: {
              user: true,
            },
          },
        },
      })

      const calendarTagRows = await listTagsByCalendarIds(db, [calendar.id])

      return {
        calendar: { ...calendar, tags: calendarTagRows[calendar.id] ?? [] },
        slots: slotRows.map((slot) => ({
          id: slot.id,
          scheduledDate: slot.scheduledDate,
          position: slot.position,
          participants: slot.entries.map(toParticipant),
        })),
      }
    },

    async findSlotDetail(calendarSlug, slotId) {
      const calendar = await db.query.calendars.findFirst({
        columns: {
          id: true,
          ownerId: true,
          slug: true,
          title: true,
          visibility: true,
          capacity: true,
        },
        where: eq(calendars.slug, calendarSlug),
      })

      if (!calendar) {
        return null
      }

      const slot = await db.query.slots.findFirst({
        where: and(eq(slots.id, slotId), eq(slots.calendarId, calendar.id)),
        with: {
          entries: {
            orderBy: asc(slotEntries.createdAt),
            with: {
              user: true,
            },
          },
        },
      })

      if (!slot) {
        return null
      }

      return {
        calendar,
        slot: {
          id: slot.id,
          scheduledDate: slot.scheduledDate,
          position: slot.position,
          participants: slot.entries.map(toParticipant),
        },
      }
    },

    async listPublishedPublic(limit, filters) {
      const conditions = [eq(calendars.visibility, 'public')]
      const query = filters?.query?.trim()
      const tag = filters?.tag?.trim()
      const today = filters?.today

      if (query) {
        conditions.push(sql`lower(${calendars.title}) LIKE ${`%${escapeLike(query.toLowerCase())}%`} ESCAPE '\\'`)
      }

      if (tag) {
        conditions.push(sql`exists (
          select 1
          from ${calendarTags}
          inner join ${tags} on ${calendarTags.tagId} = ${tags.id}
          where ${calendarTags.calendarId} = ${calendars.id}
            and ${tags.name} = ${tag}
        )`)
      }

      if (today && filters?.status === 'open') {
        conditions.push(lte(calendars.startDate, today), gte(calendars.endDate, today))
      }

      if (today && filters?.status === 'upcoming') {
        conditions.push(gt(calendars.startDate, today))
      }

      if (today && filters?.status === 'ended') {
        conditions.push(lt(calendars.endDate, today))
      }

      const calendarRows = await db.query.calendars.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit,
        with: {
          owner: true,
        },
      })
      const tagsByCalendarId = await listTagsByCalendarIds(db, calendarRows.map((calendar) => calendar.id))

      return calendarRows.map((calendar) => ({ ...calendar, tags: tagsByCalendarId[calendar.id] ?? [] }))
    },

    async listCalendarsByOwner(userId) {
      const calendarRows = await db.query.calendars.findMany({
        where: eq(calendars.ownerId, userId),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        with: {
          owner: true,
        },
      })
      const tagsByCalendarId = await listTagsByCalendarIds(db, calendarRows.map((calendar) => calendar.id))

      return calendarRows.map((calendar) => ({ ...calendar, tags: tagsByCalendarId[calendar.id] ?? [] }))
    },

    async listPublishedPublicByOwner(userId) {
      const calendarRows = await db.query.calendars.findMany({
        where: and(eq(calendars.ownerId, userId), eq(calendars.visibility, 'public')),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        with: {
          owner: true,
        },
      })
      const tagsByCalendarId = await listTagsByCalendarIds(db, calendarRows.map((calendar) => calendar.id))

      return calendarRows.map((calendar) => ({ ...calendar, tags: tagsByCalendarId[calendar.id] ?? [] }))
    },

    async findOwnerId(calendarId) {
      const calendar = await db.query.calendars.findFirst({
        columns: {
          ownerId: true,
        },
        where: eq(calendars.id, calendarId),
      })

      return calendar?.ownerId ?? null
    },

    async updateCalendar(input) {
      const result = await db
        .update(calendars)
        .set({
          title: input.title,
          description: input.description,
          visibility: input.visibility,
          capacity: input.capacity,
          updatedAt: input.now,
        })
        .where(eq(calendars.id, input.calendarId))

      if (result.meta.changes < 1) {
        return false
      }

      await replaceCalendarTags(db, input.calendarId, input.tagNames, input.now)
      return true
    },

    async deleteCalendar(calendarId) {
      const result = await db.delete(calendars).where(eq(calendars.id, calendarId))
      return result.meta.changes > 0
    },

    async joinSlot(input) {
      const slot = await db.query.slots.findFirst({
        columns: { id: true },
        where: eq(slots.id, input.slotId),
      })

      if (!slot) {
        return 'slotNotFound'
      }

      const existing = await db.query.slotEntries.findFirst({
        columns: { id: true },
        where: and(eq(slotEntries.slotId, input.slotId), eq(slotEntries.userId, input.userId)),
      })

      if (existing) {
        return 'alreadyJoined'
      }

      const result = await db.run(sql`
        insert into slot_entries (id, slot_id, user_id, description, article_title, article_url, created_at, updated_at)
        select ${input.entryId}, ${input.slotId}, ${input.userId}, NULL, NULL, NULL, ${input.now}, ${input.now}
        where (
          select count(*) from slot_entries where slot_id = ${input.slotId} and user_id is not null
        ) < (
          select capacity from calendars where id = (select calendar_id from slots where id = ${input.slotId})
        )
        and not exists (
          select 1 from slot_entries where slot_id = ${input.slotId} and user_id = ${input.userId}
        )
      `)

      const changes = result.meta?.changes ?? 0
      if (changes > 0) {
        return 'joined'
      }

      const raced = await db.query.slotEntries.findFirst({
        columns: { id: true },
        where: and(eq(slotEntries.slotId, input.slotId), eq(slotEntries.userId, input.userId)),
      })

      return raced ? 'alreadyJoined' : 'full'
    },

    async cancelSlot(input) {
      const result = await db
        .delete(slotEntries)
        .where(and(eq(slotEntries.slotId, input.slotId), eq(slotEntries.userId, input.userId)))

      return result.meta.changes > 0
    },

    async removeSlotEntry(input) {
      const result = await db.delete(slotEntries).where(eq(slotEntries.id, input.entryId))
      return result.meta.changes > 0
    },

    async findEntryOwner(entryId) {
      const entry = await db.query.slotEntries.findFirst({
        columns: { userId: true },
        where: eq(slotEntries.id, entryId),
      })

      return entry?.userId ?? null
    },

    async findEntryCalendarOwner(entryId) {
      const row = await db
        .select({
          ownerId: calendars.ownerId,
        })
        .from(slotEntries)
        .innerJoin(slots, eq(slotEntries.slotId, slots.id))
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .where(eq(slotEntries.id, entryId))
        .limit(1)

      return row[0]?.ownerId ?? null
    },

    async findEntryByUser(input) {
      const rows = await db
        .select({
          id: slotEntries.id,
          calendarId: slots.calendarId,
        })
        .from(slotEntries)
        .innerJoin(slots, eq(slotEntries.slotId, slots.id))
        .where(and(eq(slotEntries.slotId, input.slotId), eq(slotEntries.userId, input.userId)))
        .limit(1)

      return rows[0] ?? null
    },

    async findArticleEntryIdByUrl(input) {
      const rows = await db
        .select({
          id: slotEntries.id,
        })
        .from(slotEntries)
        .innerJoin(slots, eq(slotEntries.slotId, slots.id))
        .where(and(eq(slotEntries.articleUrl, input.url), eq(slots.calendarId, input.calendarId)))
        .limit(1)

      return rows[0]?.id ?? null
    },

    async updateSlotArticle(input) {
      const result = await db
        .update(slotEntries)
        .set({
          articleTitle: input.title,
          articleUrl: input.url,
          updatedAt: input.now,
        })
        .where(eq(slotEntries.id, input.entryId))

      return result.meta.changes > 0
    },

    async updateSlotDescription(input) {
      const result = await db
        .update(slotEntries)
        .set({
          description: input.description,
          updatedAt: input.now,
        })
        .where(eq(slotEntries.id, input.entryId))

      return result.meta.changes > 0
    },

    async listSlotsByUser(userId) {
      return db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          description: slotEntries.description,
          calendarSlug: calendars.slug,
          calendarTitle: calendars.title,
          articleTitle: slotEntries.articleTitle,
          articleUrl: slotEntries.articleUrl,
        })
        .from(slotEntries)
        .innerJoin(slots, eq(slotEntries.slotId, slots.id))
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .where(eq(slotEntries.userId, userId))
        .orderBy(asc(slots.scheduledDate), asc(slots.position))
    },

    async listPublishedPublicSlotsByUser(userId) {
      return db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          description: slotEntries.description,
          calendarSlug: calendars.slug,
          calendarTitle: calendars.title,
          articleTitle: slotEntries.articleTitle,
          articleUrl: slotEntries.articleUrl,
        })
        .from(slotEntries)
        .innerJoin(slots, eq(slotEntries.slotId, slots.id))
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .where(and(eq(slotEntries.userId, userId), eq(calendars.visibility, 'public')))
        .orderBy(asc(slots.scheduledDate), asc(slots.position))
    },
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`)
}

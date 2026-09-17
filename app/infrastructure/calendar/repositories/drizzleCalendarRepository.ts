import { and, asc, eq, isNull, sql } from 'drizzle-orm'
import type { CalendarRepository } from '../../../application/calendar/repositories/calendarRepository'
import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'
import type { Db } from '../../providers/db/client'
import { articles, calendars, slots, users } from '../../providers/db/schema'

export function createDrizzleCalendarRepository(db: Db): CalendarRepository {
  return {
    async findSlugsByPrefix(baseSlug) {
      const rows = await db
        .select({ slug: calendars.slug })
        .from(calendars)
        .where(sql`${calendars.slug} = ${baseSlug} OR ${calendars.slug} LIKE ${`${baseSlug}-%`}`)

      return rows.map((row) => row.slug)
    },

    async createWithSlots(calendar: NewCalendar, slotRows: NewSlot[]) {
      await db.insert(calendars).values(calendar)
      await db.insert(slots).values(slotRows)
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

      const slotRows = await db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          userId: slots.userId,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
          articleTitle: articles.title,
          articleUrl: articles.url,
        })
        .from(slots)
        .leftJoin(users, eq(slots.userId, users.id))
        .leftJoin(articles, eq(articles.slotId, slots.id))
        .where(eq(slots.calendarId, calendar.id))
        .orderBy(asc(slots.position))

      return { calendar, slots: slotRows }
    },

    async listPublishedPublic(limit) {
      return db.query.calendars.findMany({
        where: and(eq(calendars.visibility, 'public'), eq(calendars.status, 'published')),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit,
        with: {
          owner: true,
        },
      })
    },

    async joinSlot(slotId, userId, now) {
      const result = await db.update(slots).set({ userId, updatedAt: now }).where(and(eq(slots.id, slotId), isNull(slots.userId)))
      return result.meta.changes > 0
    },

    async cancelSlot(slotId, userId, now) {
      const result = await db.update(slots).set({ userId: null, updatedAt: now }).where(and(eq(slots.id, slotId), eq(slots.userId, userId)))
      return result.meta.changes > 0
    },

    async findSlotOwner(slotId) {
      const slot = await db.query.slots.findFirst({
        columns: {
          userId: true,
        },
        where: eq(slots.id, slotId),
      })

      return slot?.userId ?? null
    },

    async upsertArticle(input) {
      await db
        .insert(articles)
        .values({
          id: input.id,
          slotId: input.slotId,
          title: input.title,
          url: input.url,
          createdAt: input.now,
          updatedAt: input.now,
        })
        .onConflictDoUpdate({
          target: articles.slotId,
          set: {
            title: input.title,
            url: input.url,
            updatedAt: input.now,
          },
        })
    },

    async listSlotsByUser(userId) {
      return db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          calendarSlug: calendars.slug,
          calendarTitle: calendars.title,
          articleTitle: articles.title,
          articleUrl: articles.url,
        })
        .from(slots)
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .leftJoin(articles, eq(articles.slotId, slots.id))
        .where(eq(slots.userId, userId))
        .orderBy(asc(slots.scheduledDate), asc(slots.position))
    },
  }
}

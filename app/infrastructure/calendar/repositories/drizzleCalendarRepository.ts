import { and, asc, eq, sql } from 'drizzle-orm'
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
  }
}

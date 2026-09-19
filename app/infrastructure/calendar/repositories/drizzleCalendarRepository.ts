import { and, asc, eq, gt, isNull, lt, lte, gte, sql } from 'drizzle-orm'
import type { CalendarRepository } from '../../../application/calendar/repositories/calendarRepository'
import type { NewCalendar } from '../../../domain/calendar/entities/calendar'
import type { NewSlot } from '../../../domain/calendar/entities/slot'
import type { Db } from '../../providers/db/client'
import { articles, calendars, calendarTags, slots, tags, users } from '../../providers/db/schema'
import { attachTagsToCalendar, listTagsByCalendarIds, replaceCalendarTags } from './calendarTagQueries'

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

      const slotRows = await db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          description: slots.description,
          url: slots.url,
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

      const calendarTagRows = await listTagsByCalendarIds(db, [calendar.id])

      return { calendar: { ...calendar, tags: calendarTagRows[calendar.id] ?? [] }, slots: slotRows }
    },

    async findSlotDetail(calendarSlug, slotId) {
      const rows = await db
        .select({
          calendarId: calendars.id,
          calendarOwnerId: calendars.ownerId,
          calendarSlug: calendars.slug,
          calendarTitle: calendars.title,
          calendarVisibility: calendars.visibility,
          slotId: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          description: slots.description,
          url: slots.url,
          userId: slots.userId,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
          articleTitle: articles.title,
          articleUrl: articles.url,
        })
        .from(slots)
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .leftJoin(users, eq(slots.userId, users.id))
        .leftJoin(articles, eq(articles.slotId, slots.id))
        .where(and(eq(calendars.slug, calendarSlug), eq(slots.id, slotId)))
        .limit(1)

      const detail = rows[0]
      if (!detail) {
        return null
      }

      return {
        calendar: {
          id: detail.calendarId,
          ownerId: detail.calendarOwnerId,
          slug: detail.calendarSlug,
          title: detail.calendarTitle,
          visibility: detail.calendarVisibility,
        },
        slot: {
          id: detail.slotId,
          scheduledDate: detail.scheduledDate,
          position: detail.position,
          description: detail.description,
          url: detail.url,
          userId: detail.userId,
          username: detail.username,
          displayName: detail.displayName,
          avatarUrl: detail.avatarUrl,
          articleTitle: detail.articleTitle,
          articleUrl: detail.articleUrl,
        },
      }
    },

    async listPublishedPublic(limit, filters) {
      const conditions = [eq(calendars.visibility, 'public'), eq(calendars.status, 'published')]
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

    async joinSlot(slotId, userId, now) {
      const result = await db.update(slots).set({ userId, updatedAt: now }).where(and(eq(slots.id, slotId), isNull(slots.userId)))
      return result.meta.changes > 0
    },

    async cancelSlot(slotId, userId, now) {
      const result = await db.update(slots).set({ userId: null, updatedAt: now }).where(and(eq(slots.id, slotId), eq(slots.userId, userId)))
      return result.meta.changes > 0
    },

    async clearSlot(slotId, now) {
      const result = await db.update(slots).set({ userId: null, updatedAt: now }).where(and(eq(slots.id, slotId), sql`${slots.userId} IS NOT NULL`))
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

    async findSlotCalendarOwner(slotId) {
      const row = await db
        .select({
          ownerId: calendars.ownerId,
        })
        .from(slots)
        .innerJoin(calendars, eq(slots.calendarId, calendars.id))
        .where(eq(slots.id, slotId))
        .limit(1)

      return row[0]?.ownerId ?? null
    },

    async findArticleSlotIdByUrl(url) {
      const article = await db.query.articles.findFirst({
        columns: {
          slotId: true,
        },
        where: eq(articles.url, url),
      })

      return article?.slotId ?? null
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

    async updateSlotDescription(input) {
      const result = await db
        .update(slots)
        .set({
          description: input.description,
          updatedAt: input.now,
        })
        .where(eq(slots.id, input.slotId))

      return result.meta.changes > 0
    },

    async updateSlotUrl(input) {
      const result = await db
        .update(slots)
        .set({
          url: input.url,
          updatedAt: input.now,
        })
        .where(eq(slots.id, input.slotId))

      return result.meta.changes > 0
    },

    async listSlotsByUser(userId) {
      return db
        .select({
          id: slots.id,
          scheduledDate: slots.scheduledDate,
          position: slots.position,
          description: slots.description,
          url: slots.url,
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

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`)
}

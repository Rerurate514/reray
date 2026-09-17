import { asc, eq, inArray } from 'drizzle-orm'
import { createId } from '../../../domain/shared/services/createId'
import type { Db } from '../../providers/db/client'
import { calendarTags, tags } from '../../providers/db/schema'

export async function attachTagsToCalendar(db: Db, calendarId: string, tagNames: string[], now: number) {
  if (tagNames.length === 0) {
    return
  }

  for (const name of tagNames) {
    await db
      .insert(tags)
      .values({
        id: createId('tag'),
        name,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing({ target: tags.name })
  }

  const tagRows = await db.select({ id: tags.id }).from(tags).where(inArray(tags.name, tagNames))
  if (tagRows.length === 0) {
    return
  }

  await db
    .insert(calendarTags)
    .values(tagRows.map((tag) => ({ calendarId, tagId: tag.id })))
    .onConflictDoNothing()
}

export async function listTagsByCalendarIds(db: Db, calendarIds: string[]) {
  if (calendarIds.length === 0) {
    return {}
  }

  const rows = await db
    .select({
      calendarId: calendarTags.calendarId,
      name: tags.name,
    })
    .from(calendarTags)
    .innerJoin(tags, eq(calendarTags.tagId, tags.id))
    .where(inArray(calendarTags.calendarId, calendarIds))
    .orderBy(asc(tags.name))

  return rows.reduce<Record<string, Array<{ name: string }>>>((grouped, row) => {
    grouped[row.calendarId] ??= []
    grouped[row.calendarId].push({ name: row.name })
    return grouped
  }, {})
}

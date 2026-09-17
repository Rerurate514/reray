import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { calendars } from './calendars'
import { tags } from './tags'

export const calendarTags = sqliteTable(
  'calendar_tags',
  {
    calendarId: text('calendar_id')
      .notNull()
      .references(() => calendars.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    uniqueIndex('calendar_tags_calendar_tag_unique').on(table.calendarId, table.tagId),
    index('calendar_tags_calendar_id_idx').on(table.calendarId),
    index('calendar_tags_tag_id_idx').on(table.tagId),
  ],
)

import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { calendars } from './calendars'
import { users } from './users'

export const slots = sqliteTable(
  'slots',
  {
    id: text('id').primaryKey(),
    calendarId: text('calendar_id')
      .notNull()
      .references(() => calendars.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    scheduledDate: text('scheduled_date'),
    description: text('description'),
    position: integer('position').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('slots_calendar_position_unique').on(table.calendarId, table.position),
    index('slots_calendar_id_idx').on(table.calendarId),
    index('slots_user_id_idx').on(table.userId),
  ],
)

export type Slot = typeof slots.$inferSelect

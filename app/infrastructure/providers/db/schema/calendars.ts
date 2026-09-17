import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const calendars = sqliteTable(
  'calendars',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    visibility: text('visibility').notNull(),
    status: text('status').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('calendars_slug_unique').on(table.slug),
    index('calendars_owner_id_idx').on(table.ownerId),
  ],
)

export type Calendar = typeof calendars.$inferSelect

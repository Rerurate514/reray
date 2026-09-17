import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { slots } from './slots'

export const articles = sqliteTable(
  'articles',
  {
    id: text('id').primaryKey(),
    slotId: text('slot_id')
      .notNull()
      .references(() => slots.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    url: text('url').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [uniqueIndex('articles_slot_id_unique').on(table.slotId)],
)

export type Article = typeof articles.$inferSelect

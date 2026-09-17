import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [uniqueIndex('tags_name_unique').on(table.name)],
)

export type Tag = typeof tags.$inferSelect

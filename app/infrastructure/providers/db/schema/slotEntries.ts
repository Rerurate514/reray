import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { slots } from './slots'
import { users } from './users'

export const slotEntries = sqliteTable(
  'slot_entries',
  {
    id: text('id').primaryKey(),
    slotId: text('slot_id')
      .notNull()
      .references(() => slots.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    description: text('description'),
    articleTitle: text('article_title'),
    articleUrl: text('article_url'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('slot_entries_slot_user_unique').on(table.slotId, table.userId),
    index('slot_entries_slot_id_idx').on(table.slotId),
    index('slot_entries_user_id_idx').on(table.userId),
  ],
)

export type SlotEntry = typeof slotEntries.$inferSelect

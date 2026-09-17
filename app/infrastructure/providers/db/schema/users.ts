import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    firebaseUid: text('firebase_uid').notNull(),
    username: text('username').notNull(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('users_firebase_uid_unique').on(table.firebaseUid),
    uniqueIndex('users_username_unique').on(table.username),
  ],
)

export type User = typeof users.$inferSelect

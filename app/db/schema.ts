import { relations } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

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

export const slots = sqliteTable(
  'slots',
  {
    id: text('id').primaryKey(),
    calendarId: text('calendar_id')
      .notNull()
      .references(() => calendars.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    scheduledDate: text('scheduled_date'),
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

export const usersRelations = relations(users, ({ many }) => ({
  calendars: many(calendars),
  slots: many(slots),
}))

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  owner: one(users, {
    fields: [calendars.ownerId],
    references: [users.id],
  }),
  slots: many(slots),
}))

export const slotsRelations = relations(slots, ({ one }) => ({
  calendar: one(calendars, {
    fields: [slots.calendarId],
    references: [calendars.id],
  }),
  user: one(users, {
    fields: [slots.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [slots.id],
    references: [articles.slotId],
  }),
}))

export const articlesRelations = relations(articles, ({ one }) => ({
  slot: one(slots, {
    fields: [articles.slotId],
    references: [slots.id],
  }),
}))

export type User = typeof users.$inferSelect
export type Calendar = typeof calendars.$inferSelect
export type Slot = typeof slots.$inferSelect
export type Article = typeof articles.$inferSelect

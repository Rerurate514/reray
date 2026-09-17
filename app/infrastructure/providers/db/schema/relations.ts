import { relations } from 'drizzle-orm'
import { articles } from './articles'
import { calendars } from './calendars'
import { slots } from './slots'
import { users } from './users'

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

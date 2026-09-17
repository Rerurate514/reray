import { relations } from 'drizzle-orm'
import { articles } from './articles'
import { calendarTags } from './calendarTags'
import { calendars } from './calendars'
import { slots } from './slots'
import { tags } from './tags'
import { users } from './users'

export const usersRelations = relations(users, ({ many }) => ({
  calendars: many(calendars),
  slots: many(slots),
  calendarTags: many(calendarTags),
}))

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  owner: one(users, {
    fields: [calendars.ownerId],
    references: [users.id],
  }),
  slots: many(slots),
  calendarTags: many(calendarTags),
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

export const calendarTagsRelations = relations(calendarTags, ({ one }) => ({
  calendar: one(calendars, {
    fields: [calendarTags.calendarId],
    references: [calendars.id],
  }),
  tag: one(tags, {
    fields: [calendarTags.tagId],
    references: [tags.id],
  }),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  calendarTags: many(calendarTags),
}))

export const articlesRelations = relations(articles, ({ one }) => ({
  slot: one(slots, {
    fields: [articles.slotId],
    references: [slots.id],
  }),
}))

import { relations } from 'drizzle-orm'
import { calendarTags } from './calendarTags'
import { calendars } from './calendars'
import { slotEntries } from './slotEntries'
import { slots } from './slots'
import { tags } from './tags'
import { users } from './users'

export const usersRelations = relations(users, ({ many }) => ({
  calendars: many(calendars),
  slotEntries: many(slotEntries),
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

export const slotsRelations = relations(slots, ({ one, many }) => ({
  calendar: one(calendars, {
    fields: [slots.calendarId],
    references: [calendars.id],
  }),
  entries: many(slotEntries),
}))

export const slotEntriesRelations = relations(slotEntries, ({ one }) => ({
  slot: one(slots, {
    fields: [slotEntries.slotId],
    references: [slots.id],
  }),
  user: one(users, {
    fields: [slotEntries.userId],
    references: [users.id],
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

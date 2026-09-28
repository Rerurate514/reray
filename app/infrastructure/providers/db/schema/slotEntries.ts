import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { calendars } from "./calendars";
import { slots } from "./slots";
import { users } from "./users";

export const slotEntries = sqliteTable(
  "slot_entries",
  {
    id: text("id").primaryKey(),
    slotId: text("slot_id")
      .notNull()
      .references(() => slots.id, { onDelete: "cascade" }),
    calendarId: text("calendar_id")
      .notNull()
      .references(() => calendars.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    articleTitle: text("article_title"),
    articleUrl: text("article_url"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("slot_entries_slot_user_unique").on(table.slotId, table.userId),
    uniqueIndex("slot_entries_calendar_article_url_unique").on(
      table.calendarId,
      table.articleUrl,
    ),
    index("slot_entries_slot_id_idx").on(table.slotId),
    index("slot_entries_calendar_id_idx").on(table.calendarId),
    index("slot_entries_user_id_idx").on(table.userId),
  ],
);

export type SlotEntry = typeof slotEntries.$inferSelect;

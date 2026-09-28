import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { calendars } from "./calendars";

export const slots = sqliteTable(
  "slots",
  {
    id: text("id").primaryKey(),
    calendarId: text("calendar_id")
      .notNull()
      .references(() => calendars.id, { onDelete: "cascade" }),
    scheduledDate: text("scheduled_date"),
    position: integer("position").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("slots_calendar_position_unique").on(
      table.calendarId,
      table.position,
    ),
    index("slots_calendar_id_idx").on(table.calendarId),
  ],
);

export type Slot = typeof slots.$inferSelect;

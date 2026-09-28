PRAGMA defer_foreign_keys = on;--> statement-breakpoint
CREATE TABLE `__new_calendars` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_date` text,
	`end_date` text,
	`visibility` text NOT NULL,
	`capacity` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_calendars` (`id`, `owner_id`, `slug`, `title`, `description`, `start_date`, `end_date`, `visibility`, `capacity`, `created_at`, `updated_at`)
SELECT `id`, `owner_id`, `slug`, `title`, `description`, `start_date`, `end_date`, `visibility`, `capacity`, `created_at`, `updated_at` FROM `calendars`;
--> statement-breakpoint
DROP TABLE `calendars`;
--> statement-breakpoint
ALTER TABLE `__new_calendars` RENAME TO `calendars`;
--> statement-breakpoint
CREATE UNIQUE INDEX `calendars_slug_unique` ON `calendars` (`slug`);
--> statement-breakpoint
CREATE INDEX `calendars_owner_id_idx` ON `calendars` (`owner_id`);

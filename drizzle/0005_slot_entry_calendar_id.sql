PRAGMA defer_foreign_keys = on;--> statement-breakpoint
CREATE TABLE `__new_slot_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`calendar_id` text NOT NULL,
	`user_id` text,
	`description` text,
	`article_title` text,
	`article_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`calendar_id`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_slot_entries` (`id`, `slot_id`, `calendar_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at`)
SELECT `slot_entries`.`id`, `slot_entries`.`slot_id`, `slots`.`calendar_id`, `slot_entries`.`user_id`, `slot_entries`.`description`, `slot_entries`.`article_title`, `slot_entries`.`article_url`, `slot_entries`.`created_at`, `slot_entries`.`updated_at`
FROM `slot_entries`
INNER JOIN `slots` ON `slots`.`id` = `slot_entries`.`slot_id`;
--> statement-breakpoint
DROP TABLE `slot_entries`;
--> statement-breakpoint
ALTER TABLE `__new_slot_entries` RENAME TO `slot_entries`;
--> statement-breakpoint
CREATE UNIQUE INDEX `slot_entries_slot_user_unique` ON `slot_entries` (`slot_id`,`user_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `slot_entries_calendar_article_url_unique` ON `slot_entries` (`calendar_id`,`article_url`);
--> statement-breakpoint
CREATE INDEX `slot_entries_slot_id_idx` ON `slot_entries` (`slot_id`);
--> statement-breakpoint
CREATE INDEX `slot_entries_calendar_id_idx` ON `slot_entries` (`calendar_id`);
--> statement-breakpoint
CREATE INDEX `slot_entries_user_id_idx` ON `slot_entries` (`user_id`);

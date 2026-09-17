CREATE TABLE `calendar_tags` (
	`calendar_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`calendar_id`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `calendar_tags_calendar_tag_unique` ON `calendar_tags` (`calendar_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `calendar_tags_calendar_id_idx` ON `calendar_tags` (`calendar_id`);--> statement-breakpoint
CREATE INDEX `calendar_tags_tag_id_idx` ON `calendar_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);
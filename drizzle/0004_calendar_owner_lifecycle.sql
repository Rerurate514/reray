PRAGMA defer_foreign_keys = on;--> statement-breakpoint
-- calendars を再構築する前に、CASCADE で消える子テーブルの内容を退避する。
-- SQLite は外部キー有効時の DROP TABLE で暗黙 DELETE を実行し、ON DELETE CASCADE が
-- 発動する（defer_foreign_keys では止まらない）ため、退避してから復元する。
CREATE TABLE `__slots_backup` (
	`id` text PRIMARY KEY NOT NULL,
	`calendar_id` text NOT NULL,
	`scheduled_date` text,
	`position` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__slots_backup` (`id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at`)
SELECT `id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at` FROM `slots`;
--> statement-breakpoint
CREATE TABLE `__slot_entries_backup` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`user_id` text,
	`description` text,
	`article_title` text,
	`article_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__slot_entries_backup` (`id`, `slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at`)
SELECT `id`, `slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at` FROM `slot_entries`;
--> statement-breakpoint
CREATE TABLE `__calendar_tags_backup` (
	`calendar_id` text NOT NULL,
	`tag_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__calendar_tags_backup` (`calendar_id`, `tag_id`)
SELECT `calendar_id`, `tag_id` FROM `calendar_tags`;
--> statement-breakpoint
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
--> statement-breakpoint
-- 退避した子テーブルの内容を復元する。
INSERT INTO `slots` (`id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at`)
SELECT `id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at` FROM `__slots_backup`;
--> statement-breakpoint
INSERT INTO `slot_entries` (`id`, `slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at`)
SELECT `id`, `slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at` FROM `__slot_entries_backup`;
--> statement-breakpoint
INSERT INTO `calendar_tags` (`calendar_id`, `tag_id`)
SELECT `calendar_id`, `tag_id` FROM `__calendar_tags_backup`;
--> statement-breakpoint
DROP TABLE `__slots_backup`;
--> statement-breakpoint
DROP TABLE `__slot_entries_backup`;
--> statement-breakpoint
DROP TABLE `__calendar_tags_backup`;

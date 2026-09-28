-- 複数人が 1 枠に参加できるようにするためのマイグレーション。
-- 既存の「1 枠 = 1 担当 + 1 記事」を slot_entries の 1 件目として移行する。

-- 1. 移行元データを退避する（slots 再構築で消える前に確保）
CREATE TABLE `__slot_entry_backfill` (
	`slot_id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`description` text,
	`article_title` text,
	`article_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__slot_entry_backfill` (`slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at`)
SELECT
	`slots`.`id`,
	`slots`.`user_id`,
	`slots`.`description`,
	`articles`.`title`,
	`articles`.`url`,
	`slots`.`created_at`,
	`slots`.`updated_at`
FROM `slots`
LEFT JOIN `articles` ON `articles`.`slot_id` = `slots`.`id`
WHERE `slots`.`user_id` IS NOT NULL OR `articles`.`id` IS NOT NULL;
--> statement-breakpoint
-- 2. カレンダー単位の定員を追加（既存はすべて 1 名）
ALTER TABLE `calendars` ADD `capacity` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
-- 3. 記事テーブルは slot_entries に統合するため削除
DROP TABLE `articles`;
--> statement-breakpoint
-- 4. slots を日付と順序だけの器に再構築する
CREATE TABLE `__new_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`calendar_id` text NOT NULL,
	`scheduled_date` text,
	`position` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`calendar_id`) REFERENCES `calendars`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_slots` (`id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at`)
SELECT `id`, `calendar_id`, `scheduled_date`, `position`, `created_at`, `updated_at` FROM `slots`;
--> statement-breakpoint
DROP TABLE `slots`;
--> statement-breakpoint
ALTER TABLE `__new_slots` RENAME TO `slots`;
--> statement-breakpoint
CREATE UNIQUE INDEX `slots_calendar_position_unique` ON `slots` (`calendar_id`,`position`);
--> statement-breakpoint
CREATE INDEX `slots_calendar_id_idx` ON `slots` (`calendar_id`);
--> statement-breakpoint
-- 5. 参加者エントリテーブルを作成する
CREATE TABLE `slot_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`user_id` text,
	`description` text,
	`article_title` text,
	`article_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slot_entries_slot_user_unique` ON `slot_entries` (`slot_id`,`user_id`);
--> statement-breakpoint
CREATE INDEX `slot_entries_slot_id_idx` ON `slot_entries` (`slot_id`);
--> statement-breakpoint
CREATE INDEX `slot_entries_user_id_idx` ON `slot_entries` (`user_id`);
--> statement-breakpoint
-- 6. 退避した既存データを 1 件目のエントリとして復元する
INSERT INTO `slot_entries` (`id`, `slot_id`, `user_id`, `description`, `article_title`, `article_url`, `created_at`, `updated_at`)
SELECT
	'entry_' || `slot_id`,
	`slot_id`,
	`user_id`,
	`description`,
	`article_title`,
	`article_url`,
	`created_at`,
	`updated_at`
FROM `__slot_entry_backfill`;
--> statement-breakpoint
-- 7. 退避テーブルを削除する
DROP TABLE `__slot_entry_backfill`;

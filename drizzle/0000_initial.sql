CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `firebase_uid` text NOT NULL,
  `username` text NOT NULL,
  `display_name` text NOT NULL,
  `avatar_url` text,
  `bio` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
CREATE UNIQUE INDEX `users_firebase_uid_unique` ON `users` (`firebase_uid`);
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);

CREATE TABLE `calendars` (
  `id` text PRIMARY KEY NOT NULL,
  `owner_id` text NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `start_date` text,
  `end_date` text,
  `visibility` text NOT NULL,
  `status` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `calendars_slug_unique` ON `calendars` (`slug`);
CREATE INDEX `calendars_owner_id_idx` ON `calendars` (`owner_id`);

CREATE TABLE `slots` (
  `id` text PRIMARY KEY NOT NULL,
  `calendar_id` text NOT NULL,
  `user_id` text,
  `scheduled_date` text,
  `position` integer NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`calendar_id`) REFERENCES `calendars` (`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX `slots_calendar_position_unique` ON `slots` (`calendar_id`, `position`);
CREATE INDEX `slots_calendar_id_idx` ON `slots` (`calendar_id`);
CREATE INDEX `slots_user_id_idx` ON `slots` (`user_id`);

CREATE TABLE `articles` (
  `id` text PRIMARY KEY NOT NULL,
  `slot_id` text NOT NULL,
  `title` text NOT NULL,
  `url` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`slot_id`) REFERENCES `slots` (`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `articles_slot_id_unique` ON `articles` (`slot_id`);

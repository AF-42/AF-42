PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`kinde_id` text(255) NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`username` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`organizations` text,
	`phone` text,
	`is_password_reset_requested` integer NOT NULL,
	`is_suspended` integer NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "kinde_id", "first_name", "last_name", "username", "email", "organizations", "phone", "is_password_reset_requested", "is_suspended", "role", "created_at", "updated_at") SELECT "id", "kinde_id", "first_name", "last_name", "username", "email", "organizations", "phone", "is_password_reset_requested", "is_suspended", "role", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_kinde_id_unique` ON `users` (`kinde_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
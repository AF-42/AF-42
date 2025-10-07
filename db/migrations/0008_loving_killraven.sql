ALTER TABLE `challenges` ADD `engineer_id` text(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `challenges` DROP COLUMN `user_id`;
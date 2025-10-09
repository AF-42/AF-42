CREATE TABLE `address` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text(255) NOT NULL,
	`street_address_1` text(255) NOT NULL,
	`street_address_2` text(255) NOT NULL,
	`city_id` text(255) NOT NULL,
	`state_id` text(255) NOT NULL,
	`zip_code` text(255) NOT NULL,
	`country` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`candidate_name` text(255) NOT NULL,
	`candidate_email` text(255) NOT NULL,
	`candidate_score` integer NOT NULL,
	`candidate_evaluation_id` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text(255) NOT NULL,
	`engineer_id` text(255) NOT NULL,
	`is_published` integer NOT NULL,
	`github_url` text(255) NOT NULL,
	`challenge_industry` text(255) NOT NULL,
	`challenge_name` text(255) NOT NULL,
	`challenge_description` text(255) NOT NULL,
	`challenge_difficulty` text(255) NOT NULL,
	`challenge_type` text(255) NOT NULL,
	`challenge_status` text(255) NOT NULL,
	`challenge_requirements` text DEFAULT (json_array()) NOT NULL,
	`challenge_candidates_list` text DEFAULT (json_array()) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`address` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`state` text(255) NOT NULL,
	`zip` text(255) NOT NULL,
	`country` text(255) NOT NULL,
	`website` text(255) NOT NULL,
	`industry` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`logo` text(255) NOT NULL,
	`owner_id` text(255) NOT NULL,
	`members` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_email_unique` ON `companies` (`email`);--> statement-breakpoint
CREATE TABLE `company_members` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	`is_admin` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `completed_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`engineer_id` text(255) NOT NULL,
	`challenge_id` text(255) NOT NULL,
	`is_completed` integer NOT NULL,
	`is_validated` integer NOT NULL,
	`is_ongoing` integer NOT NULL,
	`completed_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `engineers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`address_id` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`website_url` text(255) NOT NULL,
	`github_url` text(255) NOT NULL,
	`linkedin_url` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text(255) NOT NULL,
	`candidate_id` text(255) NOT NULL,
	`evaluation_id` text(255) NOT NULL,
	`evaluation_score` integer NOT NULL,
	`evaluation_feedback` text(255) NOT NULL,
	`evaluation_status` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ongoing_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`engineer_id` text(255) NOT NULL,
	`challenge_id` text(255) NOT NULL,
	`is_ongoing` integer NOT NULL,
	`is_completed` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `requirement_items` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text(255) NOT NULL,
	`description` text(255) NOT NULL,
	`fulfilled` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`kinde_id` text(255) NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`username` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`organizations` text,
	`is_password_reset_requested` integer NOT NULL,
	`is_suspended` integer NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`is_company_member` integer NOT NULL,
	`user_since` integer NOT NULL,
	`last_login` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_kinde_id_unique` ON `users` (`kinde_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `seen_post` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`subreddit` text NOT NULL,
	`matched_keyword` text NOT NULL,
	`matched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seen_post_post_id_unique` ON `seen_post` (`post_id`);--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subreddit` text NOT NULL,
	`keyword` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

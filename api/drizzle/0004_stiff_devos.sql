ALTER TABLE `seen_post` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `seen_post` ADD `subscription_id` text NOT NULL REFERENCES subscription(id);
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`verified_purchaser` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `reviews_by_prompt` ON `reviews` (`prompt_id`);--> statement-breakpoint
CREATE INDEX `reviews_by_user` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_uniq_user_prompt` ON `reviews` (`user_id`,`prompt_id`);

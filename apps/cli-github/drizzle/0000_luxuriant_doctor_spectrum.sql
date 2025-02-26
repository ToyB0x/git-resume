CREATE TABLE `pr` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`number` integer NOT NULL,
	`additions` integer NOT NULL,
	`deletions` integer NOT NULL,
	`changed_files` integer NOT NULL,
	`merged_at` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`author_id` integer NOT NULL,
	`repository_id` integer NOT NULL,
	FOREIGN KEY (`repository_id`) REFERENCES `repository`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pr_commit` (
	`id` text PRIMARY KEY NOT NULL,
	`pr_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	`commit_at` integer NOT NULL,
	`message` text NOT NULL,
	`repository_id` integer NOT NULL,
	FOREIGN KEY (`repository_id`) REFERENCES `repository`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `repository` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAtGithub` integer,
	`updatedAtGithub` integer
);
--> statement-breakpoint
CREATE TABLE `review` (
	`id` integer PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`pr_id` integer NOT NULL,
	`reviewer_id` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`repository_id` integer NOT NULL,
	FOREIGN KEY (`repository_id`) REFERENCES `repository`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reviewComment` (
	`id` integer PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`reviewer_id` integer NOT NULL,
	`pr_id` integer NOT NULL,
	`repository_id` integer NOT NULL,
	`pull_request_review_id` integer,
	FOREIGN KEY (`repository_id`) REFERENCES `repository`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `timeline` (
	`id` integer PRIMARY KEY NOT NULL,
	`pr_id` integer NOT NULL,
	`actor_id` integer NOT NULL,
	`requested_reviewer_id` integer,
	`event_type` text NOT NULL,
	`createdAt` integer NOT NULL,
	`repository_id` integer NOT NULL,
	FOREIGN KEY (`repository_id`) REFERENCES `repository`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`login` text NOT NULL,
	`name` text,
	`blog` text,
	`avatar_url` text NOT NULL,
	`updatedAt` integer NOT NULL
);

CREATE TABLE `default_branch_commit` (
	`sha` text PRIMARY KEY NOT NULL,
	`repository_url` text NOT NULL,
	`user_login` text NOT NULL,
	`diff` text NOT NULL,
	`repo_visibility` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pr` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`repository_url` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`author_id` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`closedAt` integer,
	`diff` text NOT NULL,
	`repo_visibility` text NOT NULL
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
	`is_private` integer NOT NULL,
	`is_org_repo` integer NOT NULL,
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
CREATE TABLE `search_issues_and_prs` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`repository_url` text NOT NULL,
	`type` text NOT NULL,
	`state` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`closedAt` integer,
	`author_id` integer NOT NULL,
	`repo_visibility` text NOT NULL
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

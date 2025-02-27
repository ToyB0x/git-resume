PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_search_issues_and_prs` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`repository_url` text NOT NULL,
	`state` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`closedAt` integer,
	`author_id` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_search_issues_and_prs`("id", "number", "repository_url", "state", "title", "body", "createdAt", "updatedAt", "closedAt", "author_id") SELECT "id", "number", "repository_url", "state", "title", "body", "createdAt", "updatedAt", "closedAt", "author_id" FROM `search_issues_and_prs`;--> statement-breakpoint
DROP TABLE `search_issues_and_prs`;--> statement-breakpoint
ALTER TABLE `__new_search_issues_and_prs` RENAME TO `search_issues_and_prs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
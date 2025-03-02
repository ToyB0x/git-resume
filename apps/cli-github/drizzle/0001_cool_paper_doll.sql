CREATE TABLE `default_branch_commit` (
	`sha` text PRIMARY KEY NOT NULL,
	`repository_url` text NOT NULL,
	`user_login` text NOT NULL,
	`diff` text NOT NULL
);

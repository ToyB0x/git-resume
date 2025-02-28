CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`login` text NOT NULL,
	`name` text,
	`blog` text,
	`avatar_url` text NOT NULL,
	`updatedAt` integer NOT NULL
);

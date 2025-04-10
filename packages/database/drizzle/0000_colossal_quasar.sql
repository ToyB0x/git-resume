CREATE TABLE "job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"login" varchar(24) NOT NULL,
	"status" text,
	"progress" integer DEFAULT 0 NOT NULL,
	"resume" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_login_unique" UNIQUE("login")
);

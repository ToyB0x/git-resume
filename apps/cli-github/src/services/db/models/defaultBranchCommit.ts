import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const defaultBranchCommitTbl = sqliteTable("default_branch_commit", {
  sha: text().primaryKey(), // github pr id
  repositoryUrl: text("repository_url").notNull(),
  userLogin: text("user_login").notNull(),
  diff: text("diff").notNull(),
  repoVisibility: text("repo_visibility", {
    enum: ["public", "private"],
  }).notNull(),
});

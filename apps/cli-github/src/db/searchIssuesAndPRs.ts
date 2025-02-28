import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const searchIssuesAndPRsTbl = sqliteTable("search_issues_and_prs", {
  id: int().primaryKey(), // github issue or pr id
  number: int("number").notNull(), // github issue or pr number (eg: #123)
  repositoryUrl: text("repository_url").notNull(), // github issue or pr number (eg: #123)
  type: text("type").notNull(),
  state: text("state").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  createdAt: int({ mode: "timestamp_ms" }).notNull(),
  updatedAt: int({ mode: "timestamp_ms" }).notNull(),
  closedAt: int({ mode: "timestamp_ms" }),
  authorId: int("author_id").notNull(),
  // repositoryId: int("repository_id")
  //   .notNull()
  //   .references(() => repositoryTbl.id, {
  //     onUpdate: "cascade",
  //     onDelete: "cascade",
  //   }),
});

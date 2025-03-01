import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const prTbl = sqliteTable("pr", {
  id: int().primaryKey(), // github pr id
  number: int("number").notNull(), // github pr number (eg: #123)
  repositoryUrl: text("repository_url").notNull(), // github issue or pr number (eg: #123)
  title: text("title").notNull(),
  body: text("body"),
  authorId: int("author_id").notNull(),
  createdAt: int({ mode: "timestamp_ms" }).notNull(),
  updatedAt: int({ mode: "timestamp_ms" }).notNull(),
  closedAt: int({ mode: "timestamp_ms" }),
  diff: text("diff").notNull(),
});

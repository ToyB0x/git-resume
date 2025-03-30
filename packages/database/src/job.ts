// research_tasks テーブル
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const jobTbl = pgTable("job", {
  id: uuid().defaultRandom().primaryKey(),
  login: varchar({ length: 24 }).notNull(),
  progress: integer("progress").notNull().default(0),
  resume: text("resume"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// 型定義
export type Job = typeof jobTbl.$inferSelect;
export type NewJob = typeof jobTbl.$inferInsert;

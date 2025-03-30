// research_tasks テーブル
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const jobStatuses = [
  "SEARCHING", // リポジトリを検索中
  "CLONING", // リポジトリをClone中
  "ANALYZING", // リポジトリの活動を分析中
  "CREATING", // Resumeの作成中
  "COMPLETED", // Resume作成済み
  "FAILED", // 処理失敗
] as const;

export const jobTbl = pgTable("job", {
  id: uuid().defaultRandom().primaryKey(),
  login: varchar({ length: 24 }).notNull(),
  status: text({ enum: jobStatuses }),
  progress: integer("progress").notNull().default(0),
  resume: text("resume"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// 型定義
export type Job = typeof jobTbl.$inferSelect;
export type NewJob = typeof jobTbl.$inferInsert;

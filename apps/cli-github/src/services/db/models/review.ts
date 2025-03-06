import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { repositoryTbl } from "./repository";

export const reviewTbl = sqliteTable("review", {
  id: int().primaryKey(), // github review id
  state: text().notNull(),
  prId: int("pr_id").notNull(), // 集計順序を柔軟に変更できるようprTblとのリレーションは持たない(一定期間経過後、それぞれ独立してレコード削除するので問題ない)
  reviewerId: int("reviewer_id").notNull(), // 集計順序の都合でUserTblとのリレーションは持たない
  createdAt: int({ mode: "timestamp_ms" }).notNull(),
  repositoryId: int("repository_id") // PRテーブルを経由してリポジトリ情報を取得するのが実務上不便なのでリレーションを追加
    .notNull()
    .references(() => repositoryTbl.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
});

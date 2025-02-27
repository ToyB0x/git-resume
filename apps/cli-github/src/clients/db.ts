import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const getDbClient = (userName: string) => {
  const filePath = `sqlite/github-${userName}.db`;
  const sqliteClient = createClient({ url: `file:${filePath}` });
  return drizzle({ client: sqliteClient });
};

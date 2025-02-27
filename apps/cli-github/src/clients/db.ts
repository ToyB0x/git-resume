import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const getDbClient = () => {
  const filePath = "sqlite/github.db";
  const sqliteClient = createClient({ url: `file:${filePath}` });
  return drizzle({ client: sqliteClient });
};

export const dbClient = getDbClient();

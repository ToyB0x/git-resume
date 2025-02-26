import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite/github.db",
  },
});

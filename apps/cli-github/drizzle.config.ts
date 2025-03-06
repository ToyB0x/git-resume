import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/services/db/schemas/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite/github.db",
  },
});

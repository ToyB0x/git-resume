import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.RESUME_DB,
  },
});

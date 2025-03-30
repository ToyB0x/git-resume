import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "user",
    password: "pass",
    database: "resume",
    // ssl: true, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  },
});

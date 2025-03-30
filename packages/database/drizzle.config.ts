import { defineConfig } from "drizzle-kit";

// biome-ignore lint/complexity/useLiteralKeys: ts warning conflict
const dbUrl = process.env["RESUME_DB"];
if (!dbUrl) {
  throw Error("RESUME_DB environment variable is not set");
}

export default defineConfig({
  schema: "./src/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});

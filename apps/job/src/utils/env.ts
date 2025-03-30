import * as v from "valibot";

const envSchema = v.object({
  RESUME_GEMINI_API_KEY: v.pipe(v.string(), v.minLength(10)),
  RESUME_DB: v.pipe(v.string(), v.url()), // NEON DB URL
  // public mode では不要
  // GITHUB_TOKEN: v.pipe(v.string(), v.minLength(5)),
});

export const env = v.parse(envSchema, process.env);

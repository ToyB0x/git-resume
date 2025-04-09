import * as v from "valibot";

const envSchema = v.object({
  // RESUME_DIR: v.pipe(v.string(), v.minLength(1)), // 現在は未使用
  // RESUME_USERNAME: v.pipe(v.string(), v.minLength(3)),
  RESUME_ALLOWED_ORIGIN: v.pipe(v.string(), v.minLength(3)), // eg. "example.com"
  RESUME_DB: v.pipe(v.string(), v.url()), // NEON DB URL
});

export const env = v.parse(envSchema, process.env);

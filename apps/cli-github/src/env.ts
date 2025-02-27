import * as v from "valibot";

const envSchema = v.object({
  GITHUB_PERSONAL_ACCESS_TOKEN: v.pipe(v.string(), v.minLength(5)),
});


export const env = v.parse(envSchema, process.env);

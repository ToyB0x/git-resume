import { env } from "@/utils";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.RESUME_DB);
export const db = drizzle({ client: sql });

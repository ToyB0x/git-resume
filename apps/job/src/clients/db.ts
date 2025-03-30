import { env } from "@/utils";
import { neon } from "@neondatabase/serverless";
import { type NewJob, type jobStatuses, jobTbl } from "@resume/db";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.RESUME_DB);
const db = drizzle({ client: sql });

export const insertStatus = async (userName: string) => {
  const job: NewJob = {
    login: userName,
    status: "SEARCHING",
    progress: 0,
  };

  await db.insert(jobTbl).values(job);
};

export const updateStatus = async (
  userName: string,
  status: (typeof jobStatuses)[number],
) => {
  await db
    .update(jobTbl)
    .set({
      status,
    })
    .where(eq(jobTbl.login, userName));
};

export const updateProgress = async (userName: string, progress: number) => {
  await db
    .update(jobTbl)
    .set({
      progress,
    })
    .where(eq(jobTbl.login, userName));
};

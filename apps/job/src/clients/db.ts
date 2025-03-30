import { env } from "@/utils";
import { neon } from "@neondatabase/serverless";
import { type NewJob, type jobStatuses, jobTbl } from "@resume/db";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.RESUME_DB);
const db = drizzle({ client: sql });

export const upsertStatus = async (userName: string) => {
  const job: NewJob = {
    login: userName,
    status: "SEARCHING",
    progress: 0,
  };

  const isExistUser = await db
    .select()
    .from(jobTbl)
    .where(eq(jobTbl.login, userName));

  if (isExistUser.length > 0) {
    await db
      .update(jobTbl)
      .set({ status: job.status, progress: job.progress })
      .where(eq(jobTbl.login, userName));
  } else {
    await db.insert(jobTbl).values(job);
  }
};

export const updateStatus = async (
  userName: string,
  status: (typeof jobStatuses)[number],
) => {
  await db.update(jobTbl).set({ status }).where(eq(jobTbl.login, userName));
};

export const updateProgress = async (userName: string, progress: number) => {
  await db.update(jobTbl).set({ progress }).where(eq(jobTbl.login, userName));
};

export const addResume = async (userName: string, resume: string) => {
  await db.update(jobTbl).set({ resume }).where(eq(jobTbl.login, userName));
};

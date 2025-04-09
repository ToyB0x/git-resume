import { vValidator } from "@hono/valibot-validator";
import { jobTbl } from "@resume/db";
import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";
import * as v from "valibot";
import { db } from "../../../clients";
import { mockResumeMarkdown } from "./mock";

const factory = createFactory();

const validator = vValidator(
  "param",
  v.object({
    userName: v.pipe(v.string(), v.minLength(3)),
  }),
);

const handlers = factory.createHandlers(validator, async (c) => {
  const { userName } = c.req.valid("param");
  if (userName === "demo") {
    return c.json({ markdown: mockResumeMarkdown });
  }

  const users = await db
    .select()
    .from(jobTbl)
    .where(eq(jobTbl.login, userName));

  const user = users[0];
  if (user === undefined) {
    return c.json({ error: "User not found" }, 404);
  }

  if (user.resume === null) {
    return c.json({ error: "Resume not found" }, 404);
  }

  const { resume } = user;
  return c.json({ markdown: resume });
});

export const analysisHandler = handlers;

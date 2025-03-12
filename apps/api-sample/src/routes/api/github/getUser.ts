import { exec } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";
import { vValidator } from "@hono/valibot-validator";
import { createFactory } from "hono/factory";
import * as v from "valibot";
import { mockResumeMarkdown } from "./mock";

const execPromisified = promisify(exec);

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

  await execPromisified(
    `pnpm --filter @survive/cli-github jobs clone repositories ${userName} --public-only`,
  );

  await execPromisified(
    `pnpm --filter @survive/cli-github jobs pack create ${userName}`,
  );

  await execPromisified(
    `pnpm --filter @survive/cli-github jobs summary create ${userName} --skip-confirm`,
  );

  await execPromisified(
    `pnpm --filter @survive/cli-github jobs resume create ${userName} --skip-confirm`,
  );

  const resumeFile = fs.readFileSync(
    `../cli-github/generated/resumes/${userName}.md`,
  );

  return c.json({ markdown: resumeFile.toString() });
});

export const getUserHandler = handlers;

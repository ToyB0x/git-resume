import { vValidator } from "@hono/valibot-validator";
import { createFactory } from "hono/factory";
import * as v from "valibot";
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

  return c.json({ markdown: mockResumeMarkdown });
});

export const getUserHandler = handlers;

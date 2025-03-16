import { Hono } from "hono";
import { getUserHandler } from "./getUser";
import { getUserSseHandler } from "./getUserSse";

export const githubRoute = new Hono()
  .get(":userName", ...getUserHandler)
  .get(":userName/progress", ...getUserSseHandler);

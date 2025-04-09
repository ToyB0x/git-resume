import { Hono } from "hono";
import { analysisHandler } from "./analysis";
import { getUserHandler } from "./getUser";
import { getUserSseHandler } from "./getUserSse";

export const githubRoute = new Hono()
  .get("analysis/:userName", ...analysisHandler)
  .get(":userName", ...getUserHandler)
  .get(":userName/progress", ...getUserSseHandler);

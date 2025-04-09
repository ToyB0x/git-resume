import { Hono } from "hono";
import { analysisHandler } from "./analysis";
import { getUserHandler } from "./getUser";

export const githubRoute = new Hono()
  .get("analysis/:userName", ...analysisHandler)
  .get(":userName", ...getUserHandler);

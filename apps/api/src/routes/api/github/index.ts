import { Hono } from "hono";
import { getUserHandler } from "./getUser";

export const githubRoute = new Hono().get(":userName", ...getUserHandler);

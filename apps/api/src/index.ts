import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { githubRoute } from "./routes/api";
import { env } from "./utils";

const app = new Hono()
  .use(
    cors({
      origin: (origin) => {
        return origin.endsWith(env.RESUME_ALLOWED_ORIGIN)
          ? origin
          : "http://localhost:5173";
      },
    }),
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  })
  .route("/api/github", githubRoute);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Environment: ${env.RESUME_ENV}`);
  },
);

export type AppType = typeof app;

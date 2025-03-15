import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { githubRoute } from "./routes/api";
import { eventsRoute } from "./routes/api/events";

const app = new Hono()
  .use(
    cors({
      origin: (origin) => {
        return origin.endsWith("example.com") // TODO: update with env
          ? origin
          : "http://localhost:5173";
      },
    }),
  )
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api/github", githubRoute)
  .route("/api/events", eventsRoute);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export type AppType = typeof app;

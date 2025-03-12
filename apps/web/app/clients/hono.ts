import type { AppType } from "@resume/api/src";
import { hc } from "hono/client";
// import { publicViteEnv } from "@/env";

export const hClient = hc<AppType>("http://localhost:3000");

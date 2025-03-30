import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout/Layout.tsx", [
    index("routes/home.tsx"),
    route("github/:username/plan", "routes/github.$username.plan.tsx"),
    route("github/:username/progress", "routes/github.$username.progress.tsx"),
    route("github/:username/results", "routes/github.$username.results.tsx"),
    route("error", "routes/error.tsx"),
    route("help", "routes/help.tsx"),
    route("history", "routes/history.tsx"),
  ]),
] satisfies RouteConfig;

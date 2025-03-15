import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("github/:userId", "routes/github.$userId.tsx"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 既存のルート（互換性のために維持）
  index("routes/home.tsx"),
  route("github/:userId", "routes/github.$userId.tsx"),
  
  // 新しいルート
  route("github/:username/plan", "routes/github.$username.plan.tsx"),
  route("github/:username/progress", "routes/github.$username.progress.tsx"),
  route("github/:username/results", "routes/github.$username.results.tsx"),
  route("error", "routes/error.tsx"),
  route("help", "routes/help.tsx"),
  route("history", "routes/history.tsx"),
] satisfies RouteConfig;

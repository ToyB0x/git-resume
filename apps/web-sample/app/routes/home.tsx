import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Vibe" },
    { name: "description", content: "Explore GitHub profiles" },
  ];
}

export default function Home() {
  return <Welcome />;
}

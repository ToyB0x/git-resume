import { Welcome } from "../welcome/welcome";
import { Layout } from "../components/layout/Layout";
import type { Route } from "./+types/home";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Git Resume" },
    { name: "description", content: "Detailed analysis and automatic resume generation for GitHub users" },
  ];
}

export default function Page() {
  return (
    <Layout>
      <Welcome />
    </Layout>
  );
}

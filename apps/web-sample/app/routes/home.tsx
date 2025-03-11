import { hClient } from "~/clients";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

// biome-ignore lint/correctness/noEmptyPattern: template default
export function meta({}: Route.MetaArgs) {
  return [
    { title: "GitHub Check" },
    { name: "description", content: "Explore GitHub profiles" },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  console.log(params);
  const userResponse = await hClient.api.github[":userName"].$get({
    param: {
      userName: "test1",
    },
  });

  if (!userResponse.ok) throw Error("Failed to fetch");

  const user = await userResponse.json();

  return {
    user,
  };
}

export default function Page() {
  return <Welcome />;
}

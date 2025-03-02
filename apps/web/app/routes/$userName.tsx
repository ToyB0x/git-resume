import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Route } from "./+types/$userName";

const execPromisified = promisify(exec);

export async function loader({ params }: Route.LoaderArgs) {
  const { userName } = params;
  await execPromisified(
    `pnpm --filter @survive/cli-github jobs aggregate user ${userName}`,
  );

  await execPromisified(
    `pnpm --filter @survive/cli-github jobs explain pr-diff ${userName} > ./tmp/${userName}.txt`,
  );

  return { userName };
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { userName } = loaderData;
  return <>{userName}</>;
}

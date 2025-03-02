import { dbClient } from "@/clients";
import { prTbl, userTbl } from "@/db";
import { eq } from "drizzle-orm";

export const explainWithPrDiffs = async (userName: string): Promise<void> => {
  const userId = await dbClient
    .select()
    .from(userTbl)
    .where(eq(userTbl.login, userName))
    .get();
  if (!userId) throw new Error("User not found");

  const all = await dbClient
    .select()
    .from(prTbl)
    .where(eq(prTbl.authorId, userId.id));

  const allJsonText = all
    .filter((pr) =>
      pr.repositoryUrl.includes(`https://api.github.com/repos/${userName}`),
    )
    .filter((diff) => !diff.diff.includes("yarn.lock"))
    .filter((diff) => diff.diff.length < 50 * 1000)
    .map((diff) => diff.diff)
    .join("\n");

  console.log(allJsonText);
  // console.log(allJsonText.length);
};

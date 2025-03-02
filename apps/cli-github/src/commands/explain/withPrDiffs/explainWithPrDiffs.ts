import { dbClient } from "@/clients";
import { defaultBranchCommitTbl, prTbl, userTbl } from "@/db";
import { eq } from "drizzle-orm";

export const explainWithPrDiffs = async (userName: string): Promise<void> => {
  const userId = await dbClient
    .select()
    .from(userTbl)
    .where(eq(userTbl.login, userName))
    .get();
  if (!userId) throw new Error("User not found");

  const prCommits = await dbClient
    .select()
    .from(prTbl)
    .where(eq(prTbl.authorId, userId.id));

  const defaultBranchCommits = await dbClient
    .select()
    .from(defaultBranchCommitTbl)
    .where(eq(defaultBranchCommitTbl.userLogin, userName));

  const allCommits = [...prCommits, ...defaultBranchCommits];

  const allJsonText = allCommits
    // .filter((commit) =>
    //   commit.repositoryUrl.includes(`https://api.github.com/repos/${userName}`),
    // )
    .filter((diff) => !diff.diff.includes("yarn.lock"))
    .filter((diff) => diff.diff.length < 5 * 1000) // 5KB, ユーザにより調整が必要
    .map((diff) => diff.diff)
    .join("\n");

  console.log(allJsonText);
  // console.log(allJsonText.length);
};

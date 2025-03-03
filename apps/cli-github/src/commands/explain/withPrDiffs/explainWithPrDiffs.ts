import { dbClient } from "@/clients";
import { defaultBranchCommitTbl, userTbl } from "@/db";
import { eq } from "drizzle-orm";
import { simpleGit } from "simple-git";

export const explainWithPrDiffs = async (userName: string): Promise<void> => {
  const userId = await dbClient
    .select()
    .from(userTbl)
    .where(eq(userTbl.login, userName))
    .get();
  if (!userId) throw new Error("User not found");

  // const prCommits = await dbClient
  //   .select()
  //   .from(prTbl)
  //   .where(eq(prTbl.authorId, userId.id));

  const defaultBranchCommits = await dbClient
    .select()
    .from(defaultBranchCommitTbl)
    .where(eq(defaultBranchCommitTbl.userLogin, userName));

  const repositories = [
    ...new Set(defaultBranchCommits.map((commit) => commit.repositoryUrl)),
  ].map((repositoryUrl) => ({
    owner: repositoryUrl.split("/")[4],
    name: repositoryUrl.split("/")[5],
  }));

  for (const repo of repositories) {
    console.log("repo", repo);
    const targetDir = `./git/${repo.owner}/${repo.name}`;
    const gitClient = simpleGit(targetDir);
    const logs = await gitClient.log([`--author=${userName}`]);
    for (const log of logs.all) {
      // show log summary properties
      // console.log(log);

      const show = await gitClient.show(log.hash);

      if (show.length < 1 * 1000) {
        console.log("diff", show);
      }
    }
  }

  // const allCommits = [...prCommits, ...defaultBranchCommits];
  //
  // const allJsonText = allCommits
  //   // .filter((commit) =>
  //   //   commit.repositoryUrl.includes(`https://api.github.com/repos/${userName}`),
  //   // )
  //   .filter((diff) => !diff.diff.includes("yarn.lock"))
  //   .filter((diff) => diff.diff.length < 5 * 1000) // 5KB, ユーザにより調整が必要
  //   .map((diff) => diff.diff)
  //   .join("\n");
  //
  // console.log(allJsonText);
  // console.log(allJsonText.length);
};

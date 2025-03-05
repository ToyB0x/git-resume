import { dbClient } from "@/clients";
import { defaultBranchCommitTbl, userTbl } from "@/db";
import { eq } from "drizzle-orm";
import { simpleGit } from "simple-git";

export const packWithPrDiffs = async (userName: string): Promise<void> => {
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
    const targetDir = `./git/${repo.owner}/${repo.name}`;
    const gitClient = simpleGit(targetDir);
    const logs = await gitClient.log([`--author=${userName}`]);
    const recentLogs = logs.all.filter(
      (log) => new Date(log.date) > new Date("2022-01-01"),
    );
    for (const log of recentLogs) {
      // NOTE: if you want to see all logs, uncomment below
      // console.log(log);

      const show = await gitClient.show([log.hash, "--unified=0"]);
      const showByLines = show.split("\n");

      // NOTE: if you want to see all lines, uncomment below
      // console.log(showByLines);

      const addedLines = showByLines.filter((line) => line.startsWith("+"));

      // 500行未満の変更のみに絞る
      if (addedLines.length < 500) {
        const addedStrings = addedLines.join("\n");

        // 10KB未満の変更のみに絞る
        if (addedStrings.length < 10 * 1000) {
          console.log("diff", addedStrings);
        }
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

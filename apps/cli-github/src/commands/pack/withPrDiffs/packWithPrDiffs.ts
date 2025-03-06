import fs from "node:fs";
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

  // TODO: fileに書き出す必要はないかも？という部分を検討
  const repositories = [
    ...new Set(defaultBranchCommits.map((commit) => commit.repositoryUrl)),
  ].map((repositoryUrl) => ({
    owner: repositoryUrl.split("/")[4],
    name: repositoryUrl.split("/")[5],
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  for (const year of years) {
    for (const repo of repositories) {
      const targetDir = `./git/${repo.owner}/${repo.name}`;
      const gitClient = simpleGit(targetDir);
      const logs = await gitClient.log([`--author=${userName}`]);
      const recentLogs = logs.all.filter(
        (log) =>
          new Date(log.date) > new Date(`${year}-01-01 `) &&
          new Date(log.date) < new Date(`${year + 1}-01-01 `),
      );

      const lines: string[] = [];
      for (const log of recentLogs) {
        // NOTE: if you want to see all logs, uncomment below
        // console.log(log);

        const show = await gitClient.show([log.hash, "--unified=0"]);
        if (show.length > 3000) continue; // 変更が大きすぎるDiffはLockファイルなどを含む可能性があるためSkip

        const showByLines = show.split("\n");
        const filterLargeLines = showByLines.filter(
          (line) => line.length <= 150,
        ); // 1行が長すぎる場合はSVGなどの可能性があるため除外

        lines.push(...filterLargeLines);

        // NOTE: if you want to see all lines, uncomment below
        // console.log(showByLines);
        //
        // const addedLines = showByLines.filter((line) => line.startsWith("+"));
        //
        // // 500行未満の変更のみに絞る
        // if (addedLines.length < 500) {
        //   const addedStrings = addedLines.join("\n");
        //
        //   // 10KB未満の変更のみに絞る
        //   if (addedStrings.length < 5 * 1000) {
        //     // console.log("diff", addedStrings);
        //     lines.push(addedStrings);
        //   }
        // }
      }

      if (lines.length > 0) {
        const dir = `pack/${userName}/${repo.owner}/${repo.name}/`;
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/${year}.txt`, lines.join("\n"));
      }
    }
  }

  // console.log(lines.join("\n"));

  // const linesWithoutLockfile = removeYarnLockChanges(lines);
  // console.log(linesWithoutLockfile.join("\n"));

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

// const removeYarnLockChanges = (lines: string[]): string[] => {
//   let inYarnLock = false;
//   const filteredLines = [];
//
//   for (const line of lines) {
//     // +++ b/packages/xxx/yarn.lock
//     if (line.startsWith("+++") && line.includes("/yarn.lock")) {
//       inYarnLock = true;
//       continue; // Skip the diff header line
//     }
//     if (inYarnLock && line.startsWith("+")) {
//       continue;
//     }
//
//     if (inYarnLock && !line.startsWith("+")) {
//       inYarnLock = false;
//     }
//
//     if (!inYarnLock) {
//       filteredLines.push(line);
//     }
//   }
//
//   return filteredLines;
// };
//
// export { removeYarnLockChanges };

import fs from "node:fs";
import { simpleGit } from "simple-git";

export const create = async (userName: string, gitRepoDir: string) => {
  // const currentYear = new Date().getFullYear();
  // const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
  // for (const year of years) {

  const gitClient = simpleGit(gitRepoDir);

  const logs = await gitClient.log([`--author=${userName}`]);
  // const recentLogs = logs.all.filter(
  //     (log) =>
  //         new Date(log.date) > new Date(`${year}-01-01 `) &&
  //         new Date(log.date) < new Date(`${year + 1}-01-01 `),
  // );

  const lines: string[] = [];
  for (const log of logs.all) {
    const show = await gitClient.show([log.hash, "--unified=0"]);
    if (show.length > 5000) continue; // 変更が大きすぎるDiffはLockファイルなどを含む可能性があるためSkip

    const showByLines = show.split("\n");
    const filterLargeLines = showByLines.filter((line) => line.length <= 150); // 1行が長すぎる場合はSVGなどの可能性があるため除外

    lines.push(...filterLargeLines);
  }

  if (lines.length > 0) {
    const repoOwner = gitRepoDir.split("/").slice(-2)[0];
    const repoName = gitRepoDir.split("/").slice(-1)[0];
    if (!repoOwner || !repoName) {
      throw new Error("Invalid gitDir");
    }

    const packDir = `generated/pack/${userName}/${repoOwner}/`;
    fs.mkdirSync(packDir, { recursive: true });
    fs.writeFileSync(`${packDir}/${repoName}.txt`, lines.join("\n"));
  }
};

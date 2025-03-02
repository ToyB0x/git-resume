import fs from "node:fs";
import { dbClient } from "@/clients";
import { defaultBranchCommitTbl } from "@/db";
import { logger } from "@/utils";
import { PromisePool } from "@supercharge/promise-pool";
import { and, eq } from "drizzle-orm";
import { simpleGit } from "simple-git";

export const aggregate = async (
  userName: string,
  repoVisibility: "public" | "private",
) => {
  const commits = await dbClient
    .select()
    .from(defaultBranchCommitTbl)
    .where(
      and(
        eq(defaultBranchCommitTbl.userLogin, userName),
        eq(defaultBranchCommitTbl.repoVisibility, repoVisibility),
      ),
    );

  const repositories = [
    ...new Set(commits.map((commit) => commit.repositoryUrl)),
  ].map((repositoryUrl) => ({
    owner: repositoryUrl.split("/")[4],
    name: repositoryUrl.split("/")[5],
  }));

  const { errors } = await PromisePool.for(repositories.slice(1))
    .withConcurrency(10)
    .process(async (repo, i) => {
      logger.info(
        `Start aggregate:repository ${repo.owner}/${repo.name} (${i + 1}/${repositories.length})`,
      );

      const targetDir = `./git/${repo.owner}/${repo.name}`;
      const isExistRepo = fs.existsSync(targetDir);

      if (!isExistRepo) {
        await simpleGit().clone(
          `git@github.com:${repo.owner}/${repo.name}.git`,
          targetDir,
        );
      } else {
        // https://qiita.com/paty-fakename/items/d592806b6a4d5d2a4b55
        await simpleGit({ baseDir: targetDir }).pull();
      }
    });

  if (errors.length) {
    logger.error(`errors occurred: ${errors.length}`);
    for (const error of errors) {
      logger.error(JSON.stringify(error));
    }
  }
};

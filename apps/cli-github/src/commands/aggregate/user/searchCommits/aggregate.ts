import { dbClient, octokitApp } from "@/clients";
import { defaultBranchCommitTbl } from "@/db";
import { logger } from "@/utils";
import { PromisePool } from "@supercharge/promise-pool";

export const aggregate = async (userName: string) => {
  // https://docs.github.com/ja/rest/search/search?apiVersion=2022-11-28#search-commits
  const commits = await octokitApp.paginate(octokitApp.rest.search.commits, {
    q: `author:${userName} author-date:>2024-01-01`,
    sort: "author-date",
    order: "desc",
    per_page: 100,
  });

  const { errors } = await PromisePool.for(commits)
    .withConcurrency(8)
    .process(async (commit, i) => {
      logger.info(`Start aggregate:commit (${i + 1}/${commits.length})`);

      // https://docs.github.com/ja/rest/commits/commits?apiVersion=2022-11-28#get-a-commit
      const { data: diff } = await octokitApp.rest.repos.getCommit({
        owner: commit.repository.owner.login,
        repo: commit.repository.name,
        ref: commit.sha,
        mediaType: {
          format: "diff",
        },
      });

      // NOTE: octotik.rest.pulls.get returns diff as not `string` but actually `string`
      const diffString = diff as never as string;
      if (typeof diffString !== "string")
        throw Error("diffString is required as text");

      await dbClient
        .insert(defaultBranchCommitTbl)
        .values({
          sha: commit.sha,
          repositoryUrl: commit.repository.url,
          // TODO: user user.id
          userLogin: userName,
          // authorId: commit.author?.id,
          // TODO: get DATE
          // createdAt: commit.author?.date,
          diff: diffString,
        })
        .onConflictDoUpdate({
          target: defaultBranchCommitTbl.sha,
          set: {
            repositoryUrl: commit.repository.url,
            userLogin: userName,
            diff: diffString,
          },
        });
    });

  if (errors.length) {
    logger.error(`errors occurred: ${errors.length}`);
    for (const error of errors) {
      logger.error(JSON.stringify(error));
    }
  }
};

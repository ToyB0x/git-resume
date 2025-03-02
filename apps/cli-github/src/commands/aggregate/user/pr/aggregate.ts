import { dbClient, octokitApp } from "@/clients";
import { prTbl, searchIssuesAndPRsTbl, userTbl } from "@/db";
import { logger } from "@/utils";
import { PromisePool } from "@supercharge/promise-pool";
import { and, eq } from "drizzle-orm";

export const aggregate = async (
  userName: string,
  repoVisibility: "public" | "private",
) => {
  const user = await dbClient
    .select()
    .from(userTbl)
    .where(eq(userTbl.login, userName))
    .get();

  if (!user) throw Error("userId is required");

  const prs = await dbClient
    .select()
    .from(searchIssuesAndPRsTbl)
    .where(
      and(
        eq(searchIssuesAndPRsTbl.type, "pr"),
        eq(searchIssuesAndPRsTbl.authorId, user.id),
        eq(searchIssuesAndPRsTbl.repoVisibility, repoVisibility),
      ),
    );

  // ref: https://docs.github.com/ja/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-secondary-rate-limits
  const { errors } = await PromisePool.for(prs)
    .withConcurrency(8)
    .process(async (pr, i) => {
      logger.info(`Start aggregate:pr-diff (${i + 1}/${prs.length})`);

      const owner = pr.repositoryUrl.split("/")[4];
      const repo = pr.repositoryUrl.split("/").pop();

      if (!owner || !repo) throw Error("owner and repo are required");

      const { data: diff } = await octokitApp.rest.pulls.get({
        owner,
        repo,
        pull_number: pr.number,
        mediaType: {
          format: "diff",
        },
      });

      // NOTE: octotik.rest.pulls.get returns diff as not `string` but actually `string`
      const diffString = diff as never as string;
      if (typeof diffString !== "string")
        throw Error("diffString is required as text");

      await dbClient
        .insert(prTbl)
        .values({
          id: pr.id,
          title: pr.title,
          number: pr.number,
          repositoryUrl: pr.repositoryUrl,
          body: pr.body,
          authorId: pr.authorId,
          createdAt: pr.createdAt,
          updatedAt: pr.updatedAt,
          closedAt: pr.closedAt,
          diff: diffString,
          repoVisibility,
        })
        .onConflictDoUpdate({
          target: prTbl.id,
          set: {
            title: pr.title,
            repositoryUrl: pr.repositoryUrl,
            body: pr.body,
            updatedAt: pr.updatedAt,
            closedAt: pr.closedAt,
            diff: diffString,
            repoVisibility,
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

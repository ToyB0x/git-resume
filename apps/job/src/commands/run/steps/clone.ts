import type { search } from "@/commands/run/steps/search";
import { logger } from "@/utils";
import { gitHubService, gitService } from "@resume/services";
import { PromisePool } from "@supercharge/promise-pool";

export const clone = async (
  repositories: Awaited<ReturnType<typeof search>>,
) => {
  const withGhCommand = false;
  const { errors } = await PromisePool.for(repositories)
    .withConcurrency(10)
    .process(async (repo, i) => {
      logger.info(
        `Cloning ${repo.owner}/${repo.name} (${i + 1} / ${repositories.length})`,
      );

      if (withGhCommand) {
        await gitHubService.cloneOrPullRepositories(repo);
      } else {
        await gitService.cloneOrPullRepository(repo);
      }
    });

  if (errors.length) {
    logger.error(`errors occurred: ${errors.length}`);
    for (const error of errors) {
      logger.error(JSON.stringify(error));
    }
  }
};

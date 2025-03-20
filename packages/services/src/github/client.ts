import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "octokit";

export const getOctokit = (githubToken?: string) => {
  Octokit.plugin(throttling);

  return new Octokit({
    auth: githubToken,
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`,
        );

        if (retryCount < 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }

        return false;
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}, retrying after ${retryAfter} seconds!`,
        );
      },
    },
  });
};

export const getUsage = async (octokit: Octokit) => {
  return await octokit.rest.rateLimit.get();
  // return (await octokit.rest.rateLimit.get()).data.rate.used;
};

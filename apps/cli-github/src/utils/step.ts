import type { Octokit } from "octokit";
import { logger } from "./logger";

type Options<T> = {
  stepName: string;
  octokit: Octokit;
  callback: Promise<T>;
};

export const step = async <T>(options: Options<T>): Promise<T> => {
  logger.info(`Start ${options.stepName}`);
  try {
    const usage = await getUsage(options.octokit);
    const usedOnStart = usage.data.rate.used;

    const result = await options.callback;
    logger.info(`Finish ${options.stepName}`);

    const usageAfter = await getUsage(options.octokit);
    const usedOnEnd = usageAfter.data.rate.used;
    logger.info(
      `Usage: ${JSON.stringify(
        { ...usageAfter.data.rate, diff: usedOnEnd - usedOnStart },
        null,
        2,
      )}`,
    );

    return result;
  } catch (e) {
    logger.error(`Failed ${options.stepName}`);
    throw e;
  }
};

const getUsage = async (octokit: Octokit) => {
  return await octokit.rest.rateLimit.get();
};

import { logger } from "@/utils";
import { clone, generateResume, pack, search, summarize } from "./steps";

export const run = async (userName: string) => {
  // TODO: update status
  logger.info("searching repositories...");
  const repositories = await search(userName);

  // TODO: update status
  logger.info("cloning repositories...");
  await clone(repositories);

  // TODO: update status
  logger.info("packing repositories...");
  await pack(userName);

  // TODO: update status
  logger.info("summarizing repositories...");
  await summarize(userName);

  // TODO: update status
  logger.info("creating resume...");
  await generateResume(userName);
};

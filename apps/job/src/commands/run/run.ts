import { insertStatus, updateProgress, updateStatus } from "@/clients";
import { logger } from "@/utils";
import { clone, generateResume, pack, search, summarize } from "./steps";

export const run = async (userName: string) => {
  logger.info("searching repositories...");
  await insertStatus(userName);
  const repositories = await search(userName);
  await updateProgress(userName, 100);

  logger.info("cloning repositories...");
  await updateStatus(userName, "CLONING");
  await clone(repositories);
  await updateProgress(userName, 100);

  logger.info("packing repositories...");
  await updateStatus(userName, "ANALYZING");
  await pack(userName);
  await updateProgress(userName, 60);

  logger.info("summarizing repositories...");
  await summarize(userName);
  await updateProgress(userName, 100);

  // TODO: update status
  logger.info("creating resume...");
  await updateStatus(userName, "CREATING");
  await generateResume(userName);
  await updateProgress(userName, 100);

  await updateStatus(userName, "COMPLETED");
};

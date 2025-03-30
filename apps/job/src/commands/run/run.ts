import {
  addResume,
  updateProgress,
  updateStatus,
  upsertStatus,
} from "@/clients";
import { logger } from "@/utils";
import { clone, generateResume, pack, search, summarize } from "./steps";

export const run = async (userName: string) => {
  try {
    await _run(userName);
  } catch (error) {
    logger.error("Error during run:", error);
    await upsertStatus(userName); // if not exist, create a new status
    await updateStatus(userName, "FAILED");
  }
};

const _run = async (userName: string) => {
  logger.info("searching repositories...");
  await upsertStatus(userName);
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

  logger.info("creating resume...");
  await updateStatus(userName, "CREATING");
  const resume = await generateResume(userName);
  await addResume(userName, resume);
  await updateProgress(userName, 100);

  await updateStatus(userName, "COMPLETED");
};

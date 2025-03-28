import { Command } from "commander";
import { create } from "./create";

export const newSummaryCommand = () => {
  const summaryCmd = new Command("summary");
  summaryCmd.description("summary related commands.");

  summaryCmd
    .command("create")
    .description("Create user summaries.")
    .argument("<userName>", "userName to summarize")
    .option("-y, --skip-confirm", "skip confirmation")
    .action(async (userName, options) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await create(userName, options.skipConfirm);
    });

  return summaryCmd;
};

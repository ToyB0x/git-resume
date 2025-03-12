import { Command } from "commander";
import { create } from "./create";

export const newResumeCommand = () => {
  const resumeCmd = new Command("resume");
  resumeCmd.description("resume related commands.");

  resumeCmd
    .command("create")
    .description("Create user resume.")
    .argument("<userName>", "userName to create resume")
    .option("-y, --skip-confirm", "skip confirmation")
    .action(async (userName, options) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await create(userName, options.skipConfirm);
    });

  return resumeCmd;
};

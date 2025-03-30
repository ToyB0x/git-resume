import { Command } from "commander";
import { create } from "./create";

export const newPackCommand = () => {
  const packCmd = new Command("pack");
  packCmd.description("pack related commands.");

  packCmd
    .command("create")
    .description("Create user packs.")
    .argument("<userName>", "userName to packing")
    .action(async (userName) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await create(userName);
    });

  return packCmd;
};

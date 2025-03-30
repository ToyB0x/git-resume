import { Command } from "commander";
import { clone } from "./clone";

export const newCloneCommand = () => {
  const cloneCmd = new Command("clone");
  cloneCmd.description("clone related commands.");

  cloneCmd
    .command("repositories")
    .description(
      "Find user related repositories by Github rest search API and clone repositories.",
    )
    .argument("<userName>", "userName to clone related repositories")
    .option("--pb, --public-only", "only clone public repositories")
    .option(
      "--gh, --with-gh-command",
      "use gh clone command instead of git clone in case of git auth config not configured",
    )
    .action(async (userName, options) => {
      if (typeof userName !== "string") throw Error("userName must be string");
      await clone(userName, options.publicOnly, options.withGhCommand);
    });

  return cloneCmd;
};

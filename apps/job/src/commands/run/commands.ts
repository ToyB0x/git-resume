import { Command } from "commander";
import { run } from "./run";

export const newRunCommand = () => {
  const runCmd = new Command("run");
  runCmd.description("run batch job");

  runCmd
    .command("github", { isDefault: true })
    .description("Run batch job for specified github user.")
    .argument("<login>", "github login name")
    .action(async (login) => {
      if (typeof login !== "string") throw Error("login name must be string");
      await run(login);
    });

  return runCmd;
};

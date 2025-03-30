import { Command } from "commander";
import { newRunCommand } from "./run";

const main = async () => {
  const program = new Command();
  program.addCommand(newRunCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

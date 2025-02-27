import { Command } from "commander";
import { newAggregateCommand, newExplainCommand } from "./commands";

const main = async () => {
  const program = new Command();
  program.addCommand(newAggregateCommand());
  program.addCommand(newExplainCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

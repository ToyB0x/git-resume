import { Command } from "commander";
import {
  newAggregateCommand,
} from "./commands";

const main = async () => {
  const program = new Command();
  program.addCommand(newAggregateCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

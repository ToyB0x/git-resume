import { Command } from "commander";
import { newAggregateCommand } from "./aggregate";
import { newGenerateCommand } from "./generate";
import { newPackCommand } from "./pack";

const main = async () => {
  const program = new Command();
  program.addCommand(newAggregateCommand());
  program.addCommand(newPackCommand());
  program.addCommand(newGenerateCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

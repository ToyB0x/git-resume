import { Command } from "commander";
import { newAggregateCommand } from "./aggregate";
import { newCloneCommand } from "./clone";
import { newGenerateCommand } from "./generate";
import { newPackCommand } from "./pack";
import { newSummaryCommand } from "./summary";

const main = async () => {
  const program = new Command();
  program.addCommand(newAggregateCommand());
  program.addCommand(newPackCommand());
  program.addCommand(newGenerateCommand());
  program.addCommand(newCloneCommand());
  program.addCommand(newSummaryCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();

import { Command } from "commander";
import { newCloneCommand } from "./clone";
// import { newGenerateCommand } from "./generate";
import { newPackCommand } from "./pack";

const main = async () => {
  const program = new Command();
  // program.addCommand(newGenerateCommand());
  program.addCommand(newCloneCommand());
  program.addCommand(newPackCommand());

  try {
    await program.parseAsync();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
